import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("�� Seeding Hyperscale Infrastructure Data...");

  // Get first tenant
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    throw new Error("No tenant found. Run seed-erp.ts first.");
  }

  // 1. Region Configs
  await prisma.regionConfig.createMany({
    data: [
      {
        tenantId: tenant.id,
        regionCode: "us-east-1",
        regionName: "US East (N. Virginia)",
        primaryDatabase: "cluster-us-east.db.constructos.io",
        dataResidency: false,
      },
      {
        tenantId: tenant.id,
        regionCode: "eu-central-1",
        regionName: "EU Central (Frankfurt)",
        primaryDatabase: "cluster-eu-central.db.constructos.io",
        dataResidency: true,
      },
    ],
  });

  // 2. Infrastructure Nodes
  await prisma.infrastructureNode.createMany({
    data: [
      {
        tenantId: tenant.id,
        region: "us-east-1",
        nodeId: "worker-us-east-001",
        nodeType: "WORKER",
        cpuUsage: 45.2,
        memoryUsage: 62.1,
      },
      {
        tenantId: tenant.id,
        region: "us-east-1",
        nodeId: "api-us-east-001",
        nodeType: "API",
        cpuUsage: 78.5,
        memoryUsage: 88.0,
      },
      {
        tenantId: tenant.id,
        region: "eu-central-1",
        nodeId: "db-eu-central-001",
        nodeType: "DATABASE",
        cpuUsage: 22.4,
        memoryUsage: 40.5,
      },
    ],
  });

  // 3. Platform Services & Contracts
  await prisma.platformService.create({
    data: {
      tenantId: tenant.id,
      serviceName: "logistics-engine",
      version: "2.1.4",
      status: "HEALTHY",
      // contracts property removed as it does not exist in the schema
    },
  });

  // 4. Gateway Policies
  await prisma.gatewayPolicy.createMany({
    data: [
      {
        tenantId: tenant.id,
        routeMatch: "/api/v1/logistics/*",
        forwardTo: "logistics-engine",
        rateLimitRate: 1000,
        rateLimitWindow: 60,
      },
      {
        tenantId: tenant.id,
        routeMatch: "/api/v1/finance/*",
        forwardTo: "finance-core",
        rateLimitRate: 500,
        rateLimitWindow: 60,
      },
    ],
  });

  // 5. Distributed Tasks (Sagas)
  await prisma.distributedTask.createMany({
    data: [
      {
        tenantId: tenant.id,
        taskType: "SYNC_ERP_INVENTORY",
        payload: JSON.stringify({ items: ["ITEM-1"], target: "SAP_S4" }),
        status: "PENDING",
      },
      {
        tenantId: tenant.id,
        taskType: "CALCULATE_AGGREGATES",
        payload: JSON.stringify({ type: "DAILY_REVENUE" }),
        status: "RETRYING",
        retryCount: 2,
        errorMessage: "Connection timeout to analytics cluster",
      },
    ],
  });

  // 6. Cache Entries
  await prisma.cacheEntry.createMany({
    data: [
      {
        tenantId: tenant.id,
        cacheKey: "global:config:currency_rates",
        cacheValue: JSON.stringify({ USD: 1, EUR: 0.85, GBP: 0.73 }),
        ttlSeconds: 3600,
      },
      {
        tenantId: tenant.id,
        cacheKey: "tenant:settings:feature_flags",
        cacheValue: JSON.stringify({ enableBeta: true }),
        ttlSeconds: 86400,
      },
    ],
  });

  // 7. Platform Extensions
  await prisma.platformExtension.createMany({
    data: [
      {
        tenantId: tenant.id,
        extensionName: "Stripe Payment Gateway",
        publisher: "Maal-Material Inc.",
        version: "1.0.0",
        manifest: JSON.stringify({ hooks: ["onCheckout"] }),
      },
    ],
  });

  console.log("✅ Hyperscale Data Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
