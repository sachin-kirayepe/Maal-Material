const fs = require("fs");

const models = `
// ====================================================
// INDUSTRIAL CONSTRUCTION EXECUTION & SITE OPERATIONS
// ====================================================

model ConstructionProject {
  id              String             @id @default(uuid())
  tenantId        String?
  name            String
  code            String             @unique
  description     String?
  status          String             @default("PLANNING") // PLANNING, ACTIVE, ON_HOLD, COMPLETED
  budget          Float              @default(0.0)
  currency        String             @default("USD")
  startDate       DateTime
  estimatedEndDate DateTime
  actualEndDate   DateTime?
  location        String?
  managerId       String?
  costToDate      Float              @default(0.0)
  profitability   Float              @default(0.0)
  completionPercentage Float         @default(0.0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  phases          ConstructionPhase[]
  milestones      ConstructionMilestone[]
  boqItems        ConstructionBOQItem[]
  siteActivities  ConstructionSiteActivity[]
  issues          ConstructionProjectIssue[]

  @@index([tenantId])
  @@index([status])
  @@map("construction_projects")
}

model ConstructionPhase {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String
  name            String
  description     String?
  status          String             @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED
  startDate       DateTime?
  endDate         DateTime?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  project         ConstructionProject @relation(fields: [projectId], references: [id])
  milestones      ConstructionMilestone[]

  @@index([projectId])
  @@map("construction_phases")
}

model ConstructionMilestone {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String
  phaseId         String?
  name            String
  description     String?
  dueDate         DateTime
  isCompleted     Boolean            @default(false)
  completedAt     DateTime?
  paymentAmount   Float              @default(0.0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  project         ConstructionProject @relation(fields: [projectId], references: [id])
  phase           ConstructionPhase?  @relation(fields: [phaseId], references: [id])

  @@index([projectId])
  @@index([phaseId])
  @@map("construction_milestones")
}

model ConstructionBOQItem {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String
  itemCode        String
  description     String
  unit            String
  estimatedQty    Float
  actualQty       Float              @default(0.0)
  unitRate        Float
  totalEstimatedValue Float
  totalActualValue    Float          @default(0.0)
  category        String             @default("CIVIL") // CIVIL, MEP, FINISHES, etc.
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  project         ConstructionProject @relation(fields: [projectId], references: [id])
  consumptions    ConstructionMaterialConsumption[]

  @@index([projectId])
  @@index([itemCode])
  @@map("construction_boq_items")
}

model ConstructionSiteActivity {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String
  activityDate    DateTime           @default(now())
  reportType      String             @default("DAILY") // DAILY, WEEKLY, INCIDENT
  summary         String
  weather         String?
  progressDetails String?
  reportedBy      String
  status          String             @default("DRAFT") // DRAFT, SUBMITTED, APPROVED
  approvedBy      String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  project         ConstructionProject @relation(fields: [projectId], references: [id])

  @@index([projectId])
  @@map("construction_site_activities")
}

model ConstructionLaborAttendance {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String?
  contractorId    String?            // Links to Vendor
  workerName      String
  trade           String             // MASON, CARPENTER, PLUMBER, LABOUR
  shift           String             @default("DAY") // DAY, NIGHT
  date            DateTime
  hoursWorked     Float
  overtimeHours   Float              @default(0.0)
  wageRate        Float
  totalCalculatedWage Float
  status          String             @default("PRESENT")
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([projectId])
  @@index([date])
  @@map("construction_labor_attendance")
}

model ConstructionEquipmentAssignment {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String?
  equipmentId     String             // Links to Product/Asset
  equipmentName   String
  assignedTo      String
  assignmentDate  DateTime
  returnDate      DateTime?
  status          String             @default("ACTIVE") // ACTIVE, RETURNED, MAINTENANCE
  usageHours      Float              @default(0.0)
  fuelConsumed    Float              @default(0.0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([projectId])
  @@index([equipmentId])
  @@map("construction_equipment_assignments")
}

model ConstructionMaterialConsumption {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String?
  boqItemId       String?
  productId       String             // Links to global Product inventory
  productName     String
  quantityConsumed Float
  unit            String
  dateConsumed    DateTime
  consumedBy      String
  location        String?
  notes           String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  boqItem         ConstructionBOQItem? @relation(fields: [boqItemId], references: [id])

  @@index([projectId])
  @@index([boqItemId])
  @@map("construction_material_consumption")
}

model ConstructionProjectIssue {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String
  title           String
  description     String
  severity        String             @default("MEDIUM") // LOW, MEDIUM, HIGH, CRITICAL
  status          String             @default("OPEN") // OPEN, IN_PROGRESS, RESOLVED, BLOCKED
  reportedBy      String
  assignedTo      String?
  resolvedAt      DateTime?
  estimatedDelayDays Int             @default(0)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  project         ConstructionProject @relation(fields: [projectId], references: [id])

  @@index([projectId])
  @@index([status])
  @@map("construction_project_issues")
}

model ConstructionAuditLog {
  id              String             @id @default(uuid())
  tenantId        String?
  projectId       String?
  entityType      String             // BOQ, PROJECT, ACTIVITY
  entityId        String
  action          String             // CREATE, UPDATE, DELETE, APPROVE
  performedBy     String
  oldValues       String?            // JSON
  newValues       String?            // JSON
  createdAt       DateTime           @default(now())

  @@index([projectId])
  @@index([entityType, entityId])
  @@map("construction_audit_logs")
}
`;

fs.appendFileSync("prisma/schema.prisma", models);
console.log("Successfully appended prefixed construction models to schema.prisma");
