const fs = require("fs");

const schemaPath = "apps/api/prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const newModels = `
// ============================================================
// MULTI-TENANT & MARKETPLACE CORE MODELS
// ============================================================

model Tenant {
  id          String   @id @default(uuid())
  name        String
  domain      String?  @unique
  status      String   @default("ACTIVE") // ACTIVE, SUSPENDED, PENDING
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  shops               Shop[]
  subscriptions       TenantSubscription[]
  // Relations to domain entities
  categories          Category[]
  subCategories       SubCategory[]
  units               Unit[]
  products            Product[]
  productVariants     ProductVariant[]
  warehouses          Warehouse[]
  warehouseStocks     WarehouseStock[]
  stockMovements      StockMovement[]
  stockAdjustments    StockAdjustment[]
  stockReservations   StockReservation[]
  customers           Customer[]
  customerAddresses   CustomerAddress[]
  invoices            Invoice[]
  invoiceItems        InvoiceItem[]
  quotations          Quotation[]
  quotationItems      QuotationItem[]
  salesOrders         SalesOrder[]
  payments            Payment[]
  paymentTransactions PaymentTransaction[]
  ledgerAccounts      LedgerAccount[]
  ledgerEntries       LedgerEntry[]
  creditAccounts      CreditAccount[]
  creditTransactions  CreditTransaction[]
  settlements         Settlement[]
  reminders           Reminder[]
  reminderLogs        ReminderLog[]
  accountStatements   AccountStatement[]
  suppliers           Supplier[]
  supplierAddresses   SupplierAddress[]
  purchaseOrders      PurchaseOrder[]
  purchaseOrderItems  PurchaseOrderItem[]
  goodsReceiptNotes   GoodsReceiptNote[]
  goodsReceiptItems   GoodsReceiptItem[]
  purchaseInvoices    PurchaseInvoice[]
  purchaseInvoiceItems PurchaseInvoiceItem[]
  purchaseReturns     PurchaseReturn[]
  purchaseReturnItems PurchaseReturnItem[]
  supplierPayments    SupplierPayment[]
  supplierLedgers     SupplierLedger[]
  supplierLedgerEntries SupplierLedgerEntry[]
  procurementRequests ProcurementRequest[]
  orders              Order[]
  orderItems          OrderItem[]
  orderAddresses      OrderAddress[]
  carts               Cart[]
  cartItems           CartItem[]
  checkoutSessions    CheckoutSession[]
  fulfillments        Fulfillment[]
  fulfillmentItems    FulfillmentItem[]
  orderTimelines      OrderTimeline[]

  @@map("tenants")
}

model Shop {
  id                   String   @id @default(uuid())
  tenantId             String
  name                 String
  slug                 String   @unique
  logo                 String?
  gstin                String?
  ownerName            String?
  businessType         String   @default("HARDWARE") // HARDWARE, ELECTRICAL, PAINT, PLUMBING, INDUSTRIAL_SUPPLY
  operationalStatus    String   @default("ACTIVE")
  marketplaceVisibility Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  deletedAt            DateTime?

  tenant               Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  address              ShopAddress?
  settings             ShopSettings?
  users                ShopUser[]
  marketplaceListings  MarketplaceListing[]

  @@index([tenantId])
  @@map("shops")
}

model ShopUser {
  id        String   @id @default(uuid())
  shopId    String
  userId    String
  role      String   @default("STAFF") // OWNER, MANAGER, STAFF, CASHIER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  shop Shop @relation(fields: [shopId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([shopId, userId])
  @@index([shopId])
  @@index([userId])
  @@map("shop_users")
}

model ShopAddress {
  id          String   @id @default(uuid())
  shopId      String   @unique
  addressLine String
  city        String
  state       String
  pincode     String
  country     String   @default("India")
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  shop Shop @relation(fields: [shopId], references: [id], onDelete: Cascade)

  @@map("shop_addresses")
}

model ShopSettings {
  id                 String   @id @default(uuid())
  shopId             String   @unique
  currency           String   @default("INR")
  timezone           String   @default("Asia/Kolkata")
  taxIncludedInPrice Boolean  @default(false)
  receiptHeader      String?
  receiptFooter      String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  shop Shop @relation(fields: [shopId], references: [id], onDelete: Cascade)

  @@map("shop_settings")
}

model TenantSubscription {
  id             String    @id @default(uuid())
  tenantId       String    @unique
  planName       String    @default("FREE") // FREE, ESSENTIAL, GROWTH, ENTERPRISE
  status         String    @default("ACTIVE") // ACTIVE, PAST_DUE, CANCELLED
  billingCycle   String    @default("MONTHLY") // MONTHLY, YEARLY
  currentPeriodStart DateTime @default(now())
  currentPeriodEnd   DateTime @default(now())
  cancelAtPeriodEnd  Boolean @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("tenant_subscriptions")
}

model MarketplaceCategory {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  image       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  listings MarketplaceListing[]

  @@map("marketplace_categories")
}

model MarketplaceListing {
  id                    String   @id @default(uuid())
  shopId                String
  productId             String   @unique // The tenant's local product
  marketplaceCategoryId String
  title                 String
  description           String?
  price                 Float
  isActive              Boolean  @default(true)
  isFeatured            Boolean  @default(false)
  regionalAvailability  String?  // e.g. "Mumbai, Pune" or "All India"
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  shop     Shop                @relation(fields: [shopId], references: [id], onDelete: Cascade)
  product  Product             @relation(fields: [productId], references: [id], onDelete: Cascade)
  category MarketplaceCategory @relation(fields: [marketplaceCategoryId], references: [id])

  @@index([shopId])
  @@index([marketplaceCategoryId])
  @@index([isActive])
  @@map("marketplace_listings")
}
`;

const modelsToPatch = [
  "Category",
  "SubCategory",
  "Unit",
  "Product",
  "ProductVariant",
  "Warehouse",
  "WarehouseStock",
  "StockMovement",
  "StockAdjustment",
  "StockReservation",
  "Customer",
  "CustomerAddress",
  "Invoice",
  "InvoiceItem",
  "Quotation",
  "QuotationItem",
  "SalesOrder",
  "Payment",
  "PaymentTransaction",
  "LedgerAccount",
  "LedgerEntry",
  "CreditAccount",
  "CreditTransaction",
  "Settlement",
  "Reminder",
  "ReminderLog",
  "AccountStatement",
  "Supplier",
  "SupplierAddress",
  "PurchaseOrder",
  "PurchaseOrderItem",
  "GoodsReceiptNote",
  "GoodsReceiptItem",
  "PurchaseInvoice",
  "PurchaseInvoiceItem",
  "PurchaseReturn",
  "PurchaseReturnItem",
  "SupplierPayment",
  "SupplierLedger",
  "SupplierLedgerEntry",
  "ProcurementRequest",
  "Order",
  "OrderItem",
  "OrderAddress",
  "Cart",
  "CartItem",
  "CheckoutSession",
  "Fulfillment",
  "FulfillmentItem",
  "OrderTimeline",
];

// Append new models if not exists
if (!schema.includes("model Tenant {")) {
  schema += "\n" + newModels;
}

// User model patch for ShopUser
if (!schema.includes("shopUsers ShopUser[]")) {
  schema = schema.replace(/model User \{[\s\S]*?@@map\("users"\)\n\}/m, (match) =>
    match.replace('@@map("users")', 'shopUsers            ShopUser[]\n\n  @@map("users")'),
  );
}

// Loop and inject tenant fields
modelsToPatch.forEach((model) => {
  const regex = new RegExp(`(model ${model} \\{[\\s\\S]*?)(@@map|\\})`);
  const modelMatch = schema.match(new RegExp(`model ${model} \\{[\\s\\S]*?(@@map|\\})`));
  if (modelMatch && !modelMatch[0].includes("tenantId String?")) {
    schema = schema.replace(
      regex,
      `$1  tenantId String?\n  tenant Tenant? @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  $2`,
    );
  }
});

fs.writeFileSync(schemaPath, schema);
console.log("Schema patched successfully.");
