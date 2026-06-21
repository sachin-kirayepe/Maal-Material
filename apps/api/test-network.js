const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runTests() {
  console.log("--- Commencing B2B Network Infrastructure Tests ---");
  const tenantId = "t-001";

  try {
    // 1. Test Graph Nodes & Relationships
    const nodes = await prisma.commerceGraphNode.findMany({ where: { tenantId } });
    const edges = await prisma.commerceRelationship.findMany({ where: { tenantId } });
    console.log(
      "Commerce Graph: Found " + nodes.length + " nodes and " + edges.length + " relationships.",
    );
    if (edges.length > 0) {
      console.log(
        "   Sample Edge:",
        edges[0].sourceNodeId,
        "->",
        edges[0].targetNodeId,
        "(" + edges[0].relationshipType + ")",
      );
    }

    // 2. Test Inventory Transfers (Intent-Based Sharing)
    const transfers = await prisma.inventoryTransfer.findMany({ where: { tenantId } });
    console.log("Inventory Sharing: Found " + transfers.length + " P2P transfers.");
    transfers.forEach((t) => {
      console.log(
        "   [" +
          t.status +
          "] " +
          t.sourceEntityId +
          " -> " +
          t.targetEntityId +
          ": " +
          t.quantity +
          "x " +
          t.itemId,
      );
    });

    // 3. Test Regional Demand Insights
    const insights = await prisma.regionalDemandInsight.findMany({ where: { tenantId } });
    console.log("Vendor Discovery: Found " + insights.length + " regional insights.");
    insights.forEach((i) => {
      console.log(
        "   " +
          i.region +
          " (" +
          i.productCategory +
          ") - Demand: " +
          i.demandScore +
          ", Supply: " +
          i.supplyScore +
          ", Trend: " +
          i.trend,
      );
    });

    // 4. Test Logistics Coordination
    const logistics = await prisma.logisticsCoordination.findMany({ where: { tenantId } });
    console.log("Supply Chain Logistics: Found " + logistics.length + " active routes.");
    logistics.forEach((l) => {
      console.log(
        "   [" +
          l.status +
          "] " +
          l.referenceId +
          ": " +
          l.origin +
          " -> " +
          l.destination +
          " (Transporter: " +
          (l.transporterId || "Unassigned") +
          ")",
      );
    });

    // 5. Test RFQ
    const rfqs = await prisma.rFQExchange.findMany();
    console.log("RFQ Exchange: Found " + rfqs.length + " total RFQs in the system.");

    console.log("--- All tests passed successfully ---");
  } catch (error) {
    console.error("Test Failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
