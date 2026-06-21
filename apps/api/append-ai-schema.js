const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "prisma", "schema.prisma");

const aiModels = `

// ==========================================
// AI COMMERCE BRAIN & PREDICTIVE INTELLIGENCE
// ==========================================

model PredictionModel {
  id              String   @id @default(uuid())
  name            String
  version         String
  status          String   @default("ACTIVE") // ACTIVE, TRAINING, DEPRECATED
  accuracyScore   Float?
  lastTrainedAt   DateTime?
  hyperparameters String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  inventoryPredictions InventoryPrediction[]
  procurementPredictions ProcurementPrediction[]
}

model InventoryPrediction {
  id              String   @id @default(uuid())
  tenantId        String
  itemId          String
  modelId         String
  predictedDemand Float
  reorderPoint    Float
  confidenceScore Float
  seasonalityRisk Float
  deadStockProb   Float
  generatedAt     DateTime @default(now())
  
  predictionModel PredictionModel @relation(fields: [modelId], references: [id])
  
  @@index([tenantId, itemId])
}

model VendorIntelligence {
  id              String   @id @default(uuid())
  tenantId        String
  vendorId        String
  reliabilityScore Float
  deliveryAvgDays Float
  disputeRate     Float
  pricingTrend    String   // RISING, STABLE, FALLING
  lastEvaluatedAt DateTime @default(now())
  
  @@unique([tenantId, vendorId])
}

model CustomerRiskProfile {
  id              String   @id @default(uuid())
  tenantId        String
  customerId      String
  creditScore     Float
  delayProbability Float
  recoveryPriority String   // HIGH, MEDIUM, LOW
  outstandingRisk Float
  lastEvaluatedAt  DateTime @default(now())

  @@unique([tenantId, customerId])
}

model ContractorAnalytics {
  id               String   @id @default(uuid())
  tenantId         String
  contractorId     String
  buyingPattern    String   // BULK, FREQUENT, SEASONAL
  rfqFrequency     Float
  preferredBrands  String?
  churnRisk        Float
  lastEvaluatedAt  DateTime @default(now())

  @@unique([tenantId, contractorId])
}

model OperationalRecommendation {
  id              String   @id @default(uuid())
  tenantId        String
  module          String   // INVENTORY, PROCUREMENT, FINANCE
  title           String
  description     String
  impactScore     Float
  actionType      String
  status          String   @default("PENDING") // PENDING, ACCEPTED, REJECTED, DISMISSED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([tenantId, status])
}

model AIWorkflow {
  id              String   @id @default(uuid())
  tenantId        String
  workflowType    String   // RFQ_ASSISTANT, ORDERING
  contextData     String
  status          String   @default("PREPARED") // PREPARED, ACTIVE, COMPLETED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ProcurementPrediction {
  id                String   @id @default(uuid())
  tenantId          String
  materialCategory  String
  modelId           String
  priceForecast     Float
  trendDirection    String   // UP, DOWN, FLAT
  confidenceScore   Float
  generatedAt       DateTime @default(now())
  
  predictionModel PredictionModel @relation(fields: [modelId], references: [id])
  
  @@index([tenantId, materialCategory])
}

model CommerceForecast {
  id                String   @id @default(uuid())
  tenantId          String
  projectId         String?
  forecastType      String   // PROFITABILITY, BUDGET_OVERRUN, DELAY
  predictedValue    Float
  riskLevel         String   // LOW, MEDIUM, HIGH
  generatedAt       DateTime @default(now())

  @@index([tenantId])
}

model IntelligenceAuditLog {
  id               String   @id @default(uuid())
  tenantId         String
  recommendationId String
  userId           String
  actionTaken      String   // ACCEPTED, REJECTED
  feedback         String?
  createdAt        DateTime @default(now())
  
  @@index([tenantId, recommendationId])
}
`;

try {
  let schema = fs.readFileSync(schemaPath, "utf8");
  if (!schema.includes("model PredictionModel")) {
    fs.appendFileSync(schemaPath, aiModels);
    console.log("Successfully appended AI Intelligence models to schema.prisma");
  } else {
    console.log("AI Intelligence models already exist in schema.prisma");
  }
} catch (err) {
  console.error("Error updating schema:", err);
}
