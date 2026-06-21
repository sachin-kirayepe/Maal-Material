import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AI Intelligence data...");
  const tenantId = "t-001";

  // 1. Prediction Models
  const inventoryModel = await prisma.predictionModel.create({
    data: {
      name: "GradientBoosting_InventoryV1",
      version: "1.0.0",
      status: "ACTIVE",
      accuracyScore: 0.94,
      hyperparameters: JSON.stringify({ learningRate: 0.01, estimators: 500 }),
    },
  });

  // 2. Inventory Predictions
  await prisma.inventoryPrediction.createMany({
    data: [
      {
        tenantId,
        itemId: "ITEM-CEMENT-50KG",
        modelId: inventoryModel.id,
        predictedDemand: 450,
        reorderPoint: 120,
        confidenceScore: 0.92,
        seasonalityRisk: 0.15,
        deadStockProb: 0.05,
      },
      {
        tenantId,
        itemId: "ITEM-PAINT-10L",
        modelId: inventoryModel.id,
        predictedDemand: 12,
        reorderPoint: 5,
        confidenceScore: 0.85,
        seasonalityRisk: 0.05,
        deadStockProb: 0.82, // High dead stock risk
      },
    ],
  });

  // 3. Vendor Intelligence
  await prisma.vendorIntelligence.createMany({
    data: [
      {
        tenantId,
        vendorId: "VEND-ULTRATECH-01",
        reliabilityScore: 9.8,
        deliveryAvgDays: 1.2,
        disputeRate: 0.01,
        pricingTrend: "STABLE",
      },
      {
        tenantId,
        vendorId: "VEND-LOCAL-STEEL-09",
        reliabilityScore: 4.2,
        deliveryAvgDays: 6.5,
        disputeRate: 0.18,
        pricingTrend: "RISING",
      },
    ],
  });

  // 4. Customer Risk Profiles
  await prisma.customerRiskProfile.createMany({
    data: [
      {
        tenantId,
        customerId: "CUST-LARSEN-TOUBRO",
        creditScore: 850,
        delayProbability: 0.05,
        recoveryPriority: "LOW",
        outstandingRisk: 50000,
      },
      {
        tenantId,
        customerId: "CUST-LOCAL-BUILDER",
        creditScore: 420,
        delayProbability: 0.88,
        recoveryPriority: "HIGH",
        outstandingRisk: 850000, // High udhari risk
      },
    ],
  });

  // 5. Contractor Analytics
  await prisma.contractorAnalytics.createMany({
    data: [
      {
        tenantId,
        contractorId: "CONT-SHARMA-CIVIL",
        buyingPattern: "FREQUENT",
        rfqFrequency: 12.5, // RFQs per month
        preferredBrands: "UltraTech, TataTMT",
        churnRisk: 0.15,
      },
      {
        tenantId,
        contractorId: "CONT-VERMA-PLUMBING",
        buyingPattern: "SEASONAL",
        rfqFrequency: 1.2,
        preferredBrands: "Ashirvad, Supreme",
        churnRisk: 0.85, // High churn risk
      },
    ],
  });

  // 6. Operational Recommendations
  await prisma.operationalRecommendation.createMany({
    data: [
      {
        tenantId,
        module: "INVENTORY",
        title: "Liquidate Dead Stock: Paint 10L",
        description:
          "Predictive model indicates 82% probability of dead stock. Recommend applying a 15% discount bundle.",
        impactScore: 78.5,
        actionType: "CREATE_DISCOUNT_RULE",
      },
      {
        tenantId,
        module: "FINANCE",
        title: "High Udhari Risk: Local Builder",
        description:
          "Customer credit score dropped to 420. Recommend pausing new credit lines and escalating to collections.",
        impactScore: 94.0,
        actionType: "PAUSE_CREDIT",
      },
      {
        tenantId,
        module: "PROCUREMENT",
        title: "Switch Vendor for TMT Steel",
        description:
          "Vendor VEND-LOCAL-STEEL-09 shows rising prices and 18% dispute rate. Recommend switching to primary distributor.",
        impactScore: 88.2,
        actionType: "TRIGGER_RFQ",
      },
    ],
  });

  // 7. AI Workflows
  await prisma.aIWorkflow.createMany({
    data: [
      {
        tenantId,
        workflowType: "RFQ_ASSISTANT",
        contextData: '{"intent": "source_cement", "quantity": 500}',
        status: "PREPARED",
      },
      {
        tenantId,
        workflowType: "PAYMENT_REMINDER",
        contextData: '{"target": "CUST-LOCAL-BUILDER", "amount": 850000, "tone": "firm"}',
        status: "ACTIVE",
      },
    ],
  });

  console.log("AI Intelligence seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
