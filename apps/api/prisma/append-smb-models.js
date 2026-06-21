const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "schema.prisma");

const newModels = `
// ==========================================
// SMB Simplification & UX Architecture
// ==========================================

model SMBOnboarding {
  id                String   @id @default(uuid())
  shopId            String   @unique
  shop              Shop     @relation(fields: [shopId], references: [id])
  isProfileComplete Boolean  @default(false)
  isGstConfigured   Boolean  @default(false)
  isInventorySeeded Boolean  @default(false)
  isBillingReady    Boolean  @default(false)
  currentStep       Int      @default(1)
  businessCategory  String?  // e.g., "HARDWARE", "PAINT", "CEMENT"
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("smb_onboardings")
}

model ShopProfile {
  id                String   @id @default(uuid())
  shopId            String   @unique
  shop              Shop     @relation(fields: [shopId], references: [id])
  hindiName         String?
  tagline           String?
  primaryLanguage   String   @default("hi") // 'hi' for Hindi, 'en' for English
  defaultBillingUnit String  @default("PCS")
  smartTaxEnabled   Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("smb_shop_profiles")
}

model QuickAction {
  id                String   @id @default(uuid())
  tenantId          String
  shopId            String
  actionType        String   // e.g., "QUICK_BILL", "ADD_UDHARI", "STOCK_ENTRY"
  label             String   // e.g., "Naya Bill Banaye"
  iconUrl           String?
  orderIndex        Int      @default(0)
  isActive          Boolean  @default(true)
  metadata          String?  // JSON context (e.g. default values)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([tenantId])
  @@index([shopId])
  @@map("smb_quick_actions")
}

model WorkflowPreset {
  id                String   @id @default(uuid())
  shopId            String
  presetType        String   // e.g., "BILLING", "PROCUREMENT"
  name              String
  config            String   // JSON containing default taxes, categories, etc.
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([shopId])
  @@map("smb_workflow_presets")
}

model LocalizedLabel {
  id                String   @id @default(uuid())
  key               String   @unique // e.g., "dashboard.billing.title"
  en                String
  hi                String   // Hindi translation
  hinglish          String?  // Hinglish translation
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("smb_localized_labels")
}

model GuidedWorkflow {
  id                String   @id @default(uuid())
  workflowCode      String   @unique // e.g., "FIRST_BILL", "GST_SETUP"
  stepsCount        Int
  description       String?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("smb_guided_workflows")
}

model VoicePreparation {
  id                String   @id @default(uuid())
  shopId            String
  triggerPhrase     String   // e.g., "Cement ka bill banao"
  mappedIntent      String   // mapped to QuickAction actionType
  confidenceScore   Float?
  isActive          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([shopId])
  @@map("smb_voice_preparations")
}

model SimplifiedTemplate {
  id                String   @id @default(uuid())
  shopId            String
  templateName      String
  structure         String   // JSON of the simplified UI structure
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([shopId])
  @@map("smb_simplified_templates")
}

model CustomerShortcut {
  id                String   @id @default(uuid())
  shopId            String
  customerId        String   // references Customer.id implicitly or explicitly
  orderIndex        Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([shopId])
  @@map("smb_customer_shortcuts")
}

model SMBUsageAnalytics {
  id                String   @id @default(uuid())
  shopId            String
  metricKey         String   // e.g., "ONBOARDING_COMPLETION_TIME", "QUICK_BILLS_TODAY"
  metricValue       Float
  date              DateTime @default(now())
  
  @@index([shopId])
  @@index([date])
  @@map("smb_usage_analytics")
}
`;

let content = fs.readFileSync(schemaPath, "utf8");

if (!content.includes("model SMBOnboarding")) {
  const shopModelRegex = /model Shop\s*\{([\s\S]*?)\}/;
  const match = content.match(shopModelRegex);
  if (match) {
    let shopContent = match[1];
    if (!shopContent.includes("smbOnboarding")) {
      shopContent += `\n    smbOnboarding         SMBOnboarding?\n    shopProfile           ShopProfile?\n`;
      content = content.replace(shopModelRegex, `model Shop {${shopContent}}`);
    }
  }

  content += `\n` + newModels;
  fs.writeFileSync(schemaPath, content);
  console.log("Appended SMB models to schema.prisma");
} else {
  console.log("SMB models already exist in schema.prisma");
}
