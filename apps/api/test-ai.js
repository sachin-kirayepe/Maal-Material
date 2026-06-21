const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testApi() {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log("No tenant found. Please seed the DB.");
      return;
    }
    const tenantId = tenant.id;
    console.log(`Using Tenant ID: ${tenantId}`);

    const endpoints = [
      "/api/v1/ai/action-logs",
      "/api/v1/copilot/conversations",
      "/api/v1/recommendations",
      "/api/v1/automation/workflows",
      "/api/v1/insights/alerts",
    ];

    for (const endpoint of endpoints) {
      console.log(`\nTesting GET ${endpoint}...`);
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        headers: {
          Authorization: "Bearer dev-dummy-token",
          "x-tenant-id": tenantId,
        },
      });
      const data = await res.json();
      console.log(`Status: ${res.status}`);
      console.log(`Response:`, JSON.stringify(data).substring(0, 100) + "...");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
