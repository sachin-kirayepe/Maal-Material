const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Testing AI Models from database...");

  const recommendations = await prisma.operationalRecommendation.findMany({
    where: { tenantId: "t-001" },
  });
  console.log("Recommendations found:", recommendations.length);
  console.log(recommendations);

  const workflows = await prisma.aIWorkflow.findMany();
  console.log("AI Workflows found:", workflows.length);
}

main().finally(() => prisma.$disconnect());
