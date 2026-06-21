import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Contractor ERP data...");

  // 1. Get or create a tenant and a customer
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { name: "Default Tenant", domain: "default-tenant.constructos.com" },
    });
  }

  let customer = await prisma.customer.findFirst();
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name: "Reliance Infra",
        companyName: "Reliance Infrastructure Ltd",
        mobile: "9998887776",
      },
    });
  }

  // Seed logic for Project and Worker has been removed because the models no longer exist in the schema.
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
