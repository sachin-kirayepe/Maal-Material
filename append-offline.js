const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "apps/api/prisma/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

const models = `
// ==========================================
// OFFLINE-FIRST & RESILIENCE ARCHITECTURE
// ==========================================

model OfflineDevice {
  id              String   @id @default(uuid())
  tenantId        String
  shopId          String?
  deviceId        String   @unique
  deviceName      String?
  appVersion      String?
  lastSyncAt      DateTime?
  syncStatus      String   @default("IDLE") // IDLE, SYNCING, OFFLINE, ERROR
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  shop            Shop?    @relation(fields: [shopId], references: [id])
  checkpoints     SyncCheckpoint[]
  analytics       NetworkConditionAnalytics[]

  @@index([tenantId])
  @@index([shopId])
  @@map("offline_devices")
}

model OfflineQueue {
  id              String   @id @default(uuid())
  tenantId        String
  deviceId        String
  operationId     String   // Client-generated ID for idempotency
  entityType      String   // e.g., "Invoice", "StockMovement"
  action          String   // CREATE, UPDATE, DELETE
  payload         String   // JSON payload of the operation
  status          String   @default("PENDING") // PENDING, PROCESSING, COMPLETED, FAILED, CONFLICT
  retryCount      Int      @default(0)
  errorMessage    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, status])
  @@index([deviceId, status])
  @@map("offline_queue")
}

model SyncOperation {
  id              String   @id @default(uuid())
  tenantId        String
  deviceId        String
  batchId         String   @unique
  totalRecords    Int
  processedCount  Int      @default(0)
  failedCount     Int      @default(0)
  status          String   @default("IN_PROGRESS") // IN_PROGRESS, COMPLETED, PARTIAL, FAILED
  startedAt       DateTime @default(now())
  completedAt     DateTime?

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, deviceId])
  @@map("sync_operations")
}

model ConflictResolution {
  id              String   @id @default(uuid())
  tenantId        String
  entityType      String
  entityId        String
  serverState     String   // JSON representation of server data
  clientState     String   // JSON representation of client data
  resolutionStrategy String // SERVER_WINS, CLIENT_WINS, MANUAL, MERGED
  resolvedState   String?  // JSON representation of final resolved data
  status          String   @default("UNRESOLVED") // UNRESOLVED, RESOLVED, IGNORED
  resolvedAt      DateTime?
  createdAt       DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  audits          ReconciliationAudit[]

  @@index([tenantId, status])
  @@map("conflict_resolutions")
}

model ReconciliationAudit {
  id              String   @id @default(uuid())
  tenantId        String
  conflictId      String
  resolvedById    String
  actionTaken     String
  notes           String?
  createdAt       DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  conflict        ConflictResolution @relation(fields: [conflictId], references: [id], onDelete: Cascade)
  resolvedBy      User     @relation(fields: [resolvedById], references: [id])

  @@index([tenantId])
  @@map("reconciliation_audits")
}

model SyncCheckpoint {
  id              String   @id @default(uuid())
  tenantId        String
  deviceId        String
  entityType      String
  lastSyncToken   String   // Timestamp or opaque token for cursor-based sync
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  device          OfflineDevice @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@unique([deviceId, entityType])
  @@map("sync_checkpoints")
}

model DistributedOperation {
  id              String   @id @default(uuid())
  tenantId        String
  sagaId          String   @unique
  workflowName    String   // e.g., "OfflineQuickBill"
  currentStep     Int      @default(0)
  totalSteps      Int
  status          String   @default("RUNNING") // RUNNING, COMPLETED, COMPENSATING, FAILED
  stateData       String   // JSON
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, status])
  @@map("distributed_operations")
}

model OfflineSnapshot {
  id              String   @id @default(uuid())
  tenantId        String
  entityType      String
  entityId        String
  snapshotData    String   // JSON representation of the entity cache
  version         Int      @default(1)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, entityType, entityId])
  @@map("offline_snapshots")
}

model WhatsAppWorkflow {
  id              String   @id @default(uuid())
  tenantId        String
  shopId          String?
  phoneNumber     String
  workflowType    String   // QUOTATION, INVOICE, PAYMENT_REMINDER, ORDER
  referenceId     String   // ID of the related invoice/order
  state           String   @default("INITIATED") // INITIATED, SENT, DELIVERED, READ, RESPONDED, COMPLETED, FAILED
  contextData     String   // JSON context for conversational steps
  lastMessageAt   DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  shop            Shop?    @relation(fields: [shopId], references: [id])

  @@index([tenantId, phoneNumber])
  @@map("whatsapp_workflows")
}

model NetworkConditionAnalytics {
  id              String   @id @default(uuid())
  tenantId        String
  deviceId        String
  connectionType  String   // 4G, 3G, 2G, WIFI, OFFLINE
  effectiveType   String?  // slow-2g, 2g, 3g, 4g
  downlinkSpeed   Float?   // Mbps
  rttLatency      Int?     // milliseconds
  recordedAt      DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  device          OfflineDevice @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@index([tenantId, connectionType])
  @@map("network_analytics")
}
`;

fs.writeFileSync(schemaPath, schema + "\n" + models);
console.log("Appended Offline Models Properly");
