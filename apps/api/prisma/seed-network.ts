import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding B2B Commerce Network data...");
  const tenantId = "t-001";

  // 1. Graph Nodes
  await prisma.commerceGraphNode.createMany({
    data: [
      {
        tenantId,
        entityId: "VEND-ULTRATECH",
        nodeType: "VENDOR",
        region: "Mumbai",
        reputationScore: 920,
      },
      {
        tenantId,
        entityId: "CONT-SHARMA",
        nodeType: "CONTRACTOR",
        region: "Pune",
        reputationScore: 810,
      },
      {
        tenantId,
        entityId: "WH-CENTRAL-01",
        nodeType: "WAREHOUSE",
        region: "Mumbai",
        reputationScore: 850,
      },
      {
        tenantId,
        entityId: "DIST-LOCAL-09",
        nodeType: "DISTRIBUTOR",
        region: "Pune",
        reputationScore: 600,
      },
    ],
  });

  // 2. Graph Relationships
  await prisma.commerceRelationship.createMany({
    data: [
      {
        tenantId,
        sourceNodeId: "VEND-ULTRATECH",
        targetNodeId: "CONT-SHARMA",
        relationshipType: "PREFERRED_SUPPLIER",
        strength: 0.95,
      },
      {
        tenantId,
        sourceNodeId: "CONT-SHARMA",
        targetNodeId: "WH-CENTRAL-01",
        relationshipType: "LOGISTICS_PARTNER",
        strength: 0.8,
      },
      {
        tenantId,
        sourceNodeId: "DIST-LOCAL-09",
        targetNodeId: "VEND-ULTRATECH",
        relationshipType: "COMPETITOR",
        strength: 0.2,
      },
    ],
  });

  // 3. Inventory Transfers (P2P Intent)
  await prisma.inventoryTransfer.createMany({
    data: [
      {
        tenantId,
        sourceEntityId: "WH-CENTRAL-01",
        targetEntityId: "CONT-SHARMA",
        itemId: "STEEL-500D",
        quantity: 200,
        price: 55000,
        status: "INTENT_REGISTERED",
      },
      {
        tenantId,
        sourceEntityId: "DIST-LOCAL-09",
        targetEntityId: "WH-CENTRAL-01",
        itemId: "CEMENT-OPC",
        quantity: 500,
        price: 340,
        status: "IN_TRANSIT",
      },
    ],
  });

  // 4. Regional Insights
  await prisma.regionalDemandInsight.createMany({
    data: [
      {
        tenantId,
        region: "Mumbai",
        productCategory: "TMT Steel",
        demandScore: 95,
        supplyScore: 40,
        trend: "RISING",
      },
      {
        tenantId,
        region: "Pune",
        productCategory: "Cement",
        demandScore: 80,
        supplyScore: 85,
        trend: "STABLE",
      },
    ],
  });

  // 5. Logistics Coordination
  await prisma.logisticsCoordination.createMany({
    data: [
      {
        tenantId,
        referenceId: "ORD-901",
        transporterId: null,
        origin: "Mumbai",
        destination: "Pune",
        status: "PENDING",
      },
      {
        tenantId,
        referenceId: "ORD-902",
        transporterId: "TR-DHL-01",
        origin: "Nagpur",
        destination: "Mumbai",
        status: "DISPATCHED",
      },
    ],
  });

  console.log("Commerce Network Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
