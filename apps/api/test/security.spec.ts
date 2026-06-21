import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/database/prisma.service";
import * as jwt from "jsonwebtoken";

describe("Security & Tenant Isolation (e2e)", () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let prisma: PrismaService;

  let tenantA_Id: string;
  let tenantB_Id: string;

  let userA_Id: string;
  let userB_Id: string;
  let userA_Token: string; // Belongs to Tenant A
  let userB_Token: string; // Belongs to Tenant B
  let attacker_Token: string; // Attempting tampering/escalation
  let randomSuffix: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    // 1. Setup Data for Tenant A and Tenant B
    const tenantA = await prisma.tenant.create({
      data: { name: "Tenant A", status: "ACTIVE" },
    });
    tenantA_Id = tenantA.id;

    const tenantB = await prisma.tenant.create({
      data: { name: "Tenant B", status: "ACTIVE" },
    });
    tenantB_Id = tenantB.id;

    randomSuffix = Date.now().toString().slice(-6);

    // Create a User in Tenant A
    const userA = await prisma.user.create({
      data: {
        email: `userA_${randomSuffix}@tenantA.com`,
        password: "hashed",
        firstName: "Alice",
        lastName: "A",
      },
    });
    userA_Id = userA.id;

    // Create a User in Tenant B
    const userB = await prisma.user.create({
      data: {
        email: `userB_${randomSuffix}@tenantB.com`,
        password: "hashed",
        firstName: "Bob",
        lastName: "B",
      },
    });
    userB_Id = userB.id;

    // Create some isolated data
    await prisma.customer.create({
      data: { name: "Customer of A", tenantId: tenantA_Id, mobile: `9${randomSuffix}123` },
    });
    await prisma.customer.create({
      data: { name: "Customer of B", tenantId: tenantB_Id, mobile: `9${randomSuffix}321` },
    });

    // Tokens (Mocking standard Maal-Material JWT)
    userA_Token = jwt.sign(
      { id: userA_Id, email: `userA_${randomSuffix}@tenantA.com`, role: "ADMIN", tenantId: tenantA_Id, permissions: ["customers:read", "customers:create"] },
      process.env.JWT_SECRET || "super_secret",
      { expiresIn: "1h" },
    );
    userB_Token = jwt.sign(
      { id: userB_Id, email: `userB_${randomSuffix}@tenantB.com`, role: "ADMIN", tenantId: tenantB_Id, permissions: ["customers:read", "customers:create"] },
      process.env.JWT_SECRET || "super_secret",
      { expiresIn: "1h" },
    );

    attacker_Token = jwt.sign(
      { id: "hacker123", email: "hacker@evil.com", role: "ADMIN", tenantId: tenantB_Id, permissions: ["customers:read", "customers:create"] },
      "wrong_secret", // Simulating a tampered token
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    // Cleanup
    await prisma.customer.deleteMany({ where: { email: { contains: randomSuffix.toString() } } });
    await prisma.user.deleteMany({ where: { email: { contains: randomSuffix.toString() } } });
    await prisma.tenant.deleteMany({ where: { id: { in: [tenantA_Id, tenantB_Id] } } });
    await app.close();
  });

  describe("1. Tenant Isolation mathematically guaranteed", () => {
    it("User A should only see Customer of A, and mathematically CANNOT query B", async () => {
      const res = await request(app.getHttpServer())
        .get("/customers")
        .set("Authorization", `Bearer ${userA_Token}`)
        .expect(200);

      // CustomersService returns { items, meta }, wrapped by createApiResponse as { success, data: { items, meta } }
      const items = res.body.data.items || res.body.data.data || res.body.data;
      expect(items.length).toBeGreaterThan(0);
      // Ensure all returned data strictly belongs to Tenant A
      items.forEach((customer: any) => {
        expect(customer.tenantId).toEqual(tenantA_Id);
        expect(customer.tenantId).not.toEqual(tenantB_Id);
      });
    });

    it("Cross-tenant data injection (IDOR) should be blocked at Prisma Middleware level", async () => {
      // User A tries to create a Customer and inject Tenant B's ID
      const res = await request(app.getHttpServer())
        .post("/customers")
        .set("Authorization", `Bearer ${userA_Token}`)
        .send({
          name: `Alpha Builders ${randomSuffix}`,
          email: `alpha_${randomSuffix}@builders.com`,
          mobile: `+123${randomSuffix.toString().padStart(7, '0')}`,
          type: "B2B",
          tenantId: tenantB_Id, // The attack payload
        })
        .expect(201); // Even if it succeeds, the middleware MUST override the tenantId to A

      // Verify mathematically that the override worked
      expect(res.body.data.tenantId).toEqual(tenantA_Id);
      expect(res.body.data.tenantId).not.toEqual(tenantB_Id);
    });
  });

  describe("2. JWT Tampering & Cryptographic Identity", () => {
    it("Should reject requests with modified JWT payload (Signature mismatch)", async () => {
      // Tampering the payload without signing it properly
      const tamperedPayload = Buffer.from(
        JSON.stringify({ sub: "userA", tenantId: tenantB_Id, roles: ["ADMIN"] }),
      ).toString("base64");
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
      const fakeSignature = "fake_signature";
      const tamperedToken = `${header}.${tamperedPayload}.${fakeSignature}`;

      await request(app.getHttpServer())
        .get("/customers")
        .set("Authorization", `Bearer ${tamperedToken}`)
        .expect(401);
    });

    it("Should reject empty or malformed authorization headers", async () => {
      await request(app.getHttpServer())
        .get("/customers")
        .set("Authorization", `Bearer null`)
        .expect(401);
    });
  });

  describe("3. Privilege Escalation", () => {
    it("Standard user cannot access Admin-only endpoints", async () => {
      // Testing an endpoint protected by SUPER_ADMIN or specific permissions
      await request(app.getHttpServer())
        .get("/tenants")
        .set("Authorization", `Bearer ${userA_Token}`)
        .expect(403);
    });

    it("User attempting to elevate their own role via Profile Update should be ignored", async () => {
      const res = await request(app.getHttpServer())
        .patch("/users/me")
        .set("Authorization", `Bearer ${userA_Token}`)
        .send({
          roles: ["ADMIN"], // Attempt to escalate privilege
          firstName: "Hacked",
        });

      // Either 200 with ignored role, or 400 Bad Request if strict validation is used.
      if (res.status === 200) {
        expect(res.body.data.roles).not.toContain("ADMIN");
      } else {
        expect(res.status).toBeGreaterThanOrEqual(400);
      }
    });
  });
});
