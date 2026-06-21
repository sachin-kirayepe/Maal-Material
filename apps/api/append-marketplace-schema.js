const fs = require("fs");
const path = require("path");

const models = `
// ====================================================
// INDUSTRIAL B2B MARKETPLACE & ECOSYSTEM
// ====================================================

model MarketplaceVendor {
  id              String             @id @default(uuid())
  tenantId        String?
  vendorName      String
  vendorCode      String             @unique
  industryType    String             @default("MANUFACTURER") // MANUFACTURER, DISTRIBUTOR, WHOLESALER, LOGISTICS
  verificationLevel String           @default("UNVERIFIED") // UNVERIFIED, VERIFIED, ENTERPRISE, PLATINUM
  establishedYear Int?
  taxId           String?
  globalRegion    String?
  contactEmail    String
  contactPhone    String?
  status          String             @default("ACTIVE") // ACTIVE, SUSPENDED, PENDING
  rating          Float              @default(0.0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  storefronts     VendorStorefront[]
  quotations      MarketplaceQuotation[]
  orders          CommerceOrder[]
  settlements     MarketplaceSettlement[]
  connections     EcosystemConnection[]
  ratings         VendorRating[]

  @@index([vendorCode])
  @@index([industryType])
  @@index([globalRegion])
  @@map("b2b_marketplace_vendors")
}

model VendorStorefront {
  id              String             @id @default(uuid())
  vendorId        String
  storeName       String
  storeDescription String?
  bannerUrl       String?
  logoUrl         String?
  isPublic        Boolean            @default(true)
  supportedCurrencies String         @default("USD") // Comma separated
  minOrderValue   Float              @default(0.0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@index([vendorId])
  @@map("b2b_vendor_storefronts")
}

model RFQExchange {
  id              String             @id @default(uuid())
  tenantId        String?
  rfqCode         String             @unique
  title           String
  description     String
  targetCategory  String             // RAW_MATERIALS, MACHINERY, LOGISTICS, LABOR
  budgetMax       Float?
  currency        String             @default("USD")
  deadline        DateTime
  status          String             @default("OPEN") // OPEN, REVIEWING, AWARDED, CLOSED, CANCELLED
  deliveryLocation String?
  requiredCompliance String?         // ISO, CE, etc.
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  quotations      MarketplaceQuotation[]

  @@index([rfqCode])
  @@index([status])
  @@map("b2b_rfq_exchanges")
}

model MarketplaceQuotation {
  id              String             @id @default(uuid())
  rfqId           String
  vendorId        String
  quoteAmount     Float
  currency        String             @default("USD")
  validUntil      DateTime
  deliveryLeadTimeDays Int           @default(0)
  termsAndConditions String?
  status          String             @default("SUBMITTED") // SUBMITTED, NEGOTIATING, ACCEPTED, REJECTED
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  rfq             RFQExchange        @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id])

  @@index([rfqId])
  @@index([vendorId])
  @@index([status])
  @@map("b2b_marketplace_quotations")
}

model CommerceOrder {
  id              String             @id @default(uuid())
  tenantId        String?
  orderNumber     String             @unique
  vendorId        String
  totalAmount     Float
  currency        String             @default("USD")
  paymentTerms    String             @default("NET_30") // ADVANCE, NET_30, NET_60
  fulfillmentStatus String           @default("PENDING") // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  paymentStatus   String             @default("UNPAID") // UNPAID, PARTIAL, PAID
  shippingAddress String?
  expectedDelivery DateTime?
  actualDelivery  DateTime?
  notes           String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id])
  disputes        CommerceDispute[]
  settlements     MarketplaceSettlement[]

  @@index([orderNumber])
  @@index([vendorId])
  @@index([fulfillmentStatus])
  @@map("b2b_commerce_orders")
}

model CommerceDispute {
  id              String             @id @default(uuid())
  orderId         String
  disputeReason   String             // QUALITY, DELAY, PAYMENT, DAMAGE
  description     String
  status          String             @default("OPEN") // OPEN, UNDER_REVIEW, RESOLVED_REFUND, RESOLVED_REJECTED
  resolutionNotes String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  order           CommerceOrder      @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([status])
  @@map("b2b_commerce_disputes")
}

model MarketplaceSettlement {
  id              String             @id @default(uuid())
  orderId         String
  vendorId        String
  settlementAmount Float
  currency        String             @default("USD")
  platformFeeAmount Float            @default(0.0)
  netVendorAmount Float
  settlementStatus String            @default("PENDING") // PENDING, PROCESSING, COMPLETED, FAILED
  transactionRef  String?            @unique
  processedAt     DateTime?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  order           CommerceOrder      @relation(fields: [orderId], references: [id])
  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id])

  @@index([orderId])
  @@index([vendorId])
  @@index([settlementStatus])
  @@map("b2b_marketplace_settlements")
}

model VendorRating {
  id              String             @id @default(uuid())
  vendorId        String
  tenantId        String?            // Who rated them
  ratingScore     Float              // 1.0 to 5.0
  reviewText      String?
  criteria        String             @default("GENERAL") // QUALITY, DELIVERY, PRICING, COMMUNICATION
  createdAt       DateTime           @default(now())

  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@index([vendorId])
  @@index([ratingScore])
  @@map("b2b_vendor_ratings")
}

model EcosystemConnection {
  id              String             @id @default(uuid())
  tenantId        String             // The enterprise connecting
  vendorId        String             // The vendor being connected to
  connectionType  String             @default("PREFERRED_SUPPLIER") // PREFERRED_SUPPLIER, STRATEGIC_PARTNER, BLACKLISTED
  approvedBy      String?
  isActive        Boolean            @default(true)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  vendor          MarketplaceVendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([vendorId])
  @@map("b2b_ecosystem_connections")
}

model CommerceAuditLog {
  id              String             @id @default(uuid())
  tenantId        String?
  entityType      String             // ORDER, RFQ, SETTLEMENT, VENDOR
  entityId        String
  action          String             // CREATE, UPDATE, DELETE, APPROVE, DISPUTE
  performedBy     String
  details         String?            // JSON representation of changes
  createdAt       DateTime           @default(now())

  @@index([entityType, entityId])
  @@index([tenantId])
  @@map("b2b_commerce_audit_logs")
}
`;

const schemaPath = path.join(__dirname, "prisma", "schema.prisma");
fs.appendFileSync(schemaPath, models);
console.log("Successfully appended marketplace schema models.");
