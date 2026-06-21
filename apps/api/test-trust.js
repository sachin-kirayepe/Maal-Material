const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Testing Trust Infrastructure from database...");

  const profiles = await prisma.trustProfile.findMany({
    where: { tenantId: "t-001" },
  });
  console.log("Trust Profiles found:", profiles.length);

  const fraudSignals = await prisma.fraudSignal.findMany({
    where: { tenantId: "t-001" },
  });
  console.log("Fraud Signals found:", fraudSignals.length);
  console.log(JSON.stringify(fraudSignals, null, 2));

  const disputes = await prisma.disputeCase.findMany();
  console.log("Dispute Cases found:", disputes.length);
}

main().finally(() => prisma.$disconnect());
