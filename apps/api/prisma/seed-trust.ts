import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Trust Infrastructure data...");
  const tenantId = "t-001";

  // 1. Trust Profiles
  await prisma.trustProfile.createMany({
    data: [
      {
        tenantId,
        entityType: "VENDOR",
        entityId: "VEND-ULTRATECH-01",
        trustScore: 920,
        gstVerified: true,
        kycStatus: "VERIFIED",
        operationalScore: 95,
        status: "ACTIVE",
      },
      {
        tenantId,
        entityType: "VENDOR",
        entityId: "VEND-LOCAL-STEEL-09",
        trustScore: 420,
        gstVerified: false,
        kycStatus: "PENDING",
        operationalScore: 40,
        status: "ACTIVE", // Advisory only, not blocked
      },
      {
        tenantId,
        entityType: "CUSTOMER",
        entityId: "CUST-LARSEN-TOUBRO",
        trustScore: 880,
        gstVerified: true,
        kycStatus: "VERIFIED",
        operationalScore: 90,
        status: "ACTIVE",
      },
    ],
  });

  // 2. Fraud Signals
  await prisma.fraudSignal.createMany({
    data: [
      {
        tenantId,
        entityId: "VEND-LOCAL-STEEL-09",
        signalType: "PRICE_MANIPULATION",
        severity: "CRITICAL",
        description:
          "Vendor increased TMT steel prices by 40% immediately following RFQ broadcast.",
        status: "OPEN",
      },
      {
        tenantId,
        entityId: "CONT-SHARMA-CIVIL",
        signalType: "ABNORMAL_STOCK",
        severity: "MEDIUM",
        description: "Contractor ordering 5x usual cement volume outside of active project phases.",
        status: "INVESTIGATING",
      },
    ],
  });

  // 3. Dispute Cases
  await prisma.disputeCase.createMany({
    data: [
      {
        tenantId,
        referenceId: "INV-4402",
        disputeType: "QUALITY",
        raisedBy: "CONT-SHARMA-CIVIL",
        againstEntityId: "VEND-LOCAL-STEEL-09",
        description: "TMT steel bars delivered have severe rusting. Unfit for construction.",
        status: "OPEN",
      },
      {
        tenantId,
        referenceId: "ORD-9912",
        disputeType: "DELIVERY",
        raisedBy: "CUST-LARSEN-TOUBRO",
        againstEntityId: "LOGISTICS-01",
        description: "Cement delivery delayed by 4 days causing labor idle time.",
        status: "MEDIATION",
      },
    ],
  });

  // 4. Risk Assessments
  await prisma.riskAssessment.createMany({
    data: [
      {
        tenantId,
        entityId: "CUST-LOCAL-BUILDER",
        riskType: "BAD_DEBT",
        riskScore: 85,
        flagged: true,
        analysisDetails:
          "Historical payment delays average 45 days. High probability of default on next invoice.",
      },
      {
        tenantId,
        entityId: "VEND-ULTRATECH-01",
        riskType: "OPERATIONAL_RISK",
        riskScore: 5,
        flagged: false,
        analysisDetails: "Highly reliable. Consistent delivery windows.",
      },
    ],
  });

  // 5. Reputation Scores
  await prisma.reputationScore.createMany({
    data: [
      {
        tenantId,
        vendorId: "VEND-ULTRATECH-01",
        deliveryConsistency: 98,
        fulfillmentQuality: 99,
        paymentReliability: 100,
        disputeFrequency: 0.1,
      },
      {
        tenantId,
        vendorId: "VEND-LOCAL-STEEL-09",
        deliveryConsistency: 60,
        fulfillmentQuality: 75,
        paymentReliability: 80,
        disputeFrequency: 5.5,
      },
    ],
  });

  console.log("Trust Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
