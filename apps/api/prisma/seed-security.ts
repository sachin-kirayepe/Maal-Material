import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Enterprise Security, Audit, & Observability Data...");

  const org = await prisma.tenant.findFirst();
  if (!org) {
    console.error("No tenant found. Run seed-erp.ts first.");
    return;
  }

  const user = await prisma.user.findFirst();

  // 1. Security Events
  console.log("Seeding Security Events...");
  await prisma.securityEvent.createMany({
    data: [
      {
        tenantId: org.id,
        userId: user?.id,
        eventType: "LOGIN_SUCCESS",
        severity: "INFO",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      },
      {
        tenantId: org.id,
        userId: user?.id,
        eventType: "LOGIN_FAILED",
        severity: "WARNING",
        ipAddress: "192.168.1.20",
        userAgent: "PostmanRuntime/7.28.0",
      },
      {
        tenantId: org.id,
        eventType: "RATE_LIMIT_EXCEEDED",
        severity: "CRITICAL",
        ipAddress: "10.0.0.55",
        metadata: JSON.stringify({ endpoint: "/api/v1/auth" }),
      },
      {
        tenantId: org.id,
        eventType: "UNAUTHORIZED_ACCESS",
        severity: "WARNING",
        ipAddress: "10.0.0.12",
        metadata: JSON.stringify({ resource: "/api/v1/financials" }),
      },
    ],
  });

  // 2. Audit Trails
  console.log("Seeding Audit Trails...");
  await prisma.auditTrail.createMany({
    data: [
      {
        tenantId: org.id,
        userId: user?.id,
        action: "CREATE_PRODUCT",
        entityType: "Product",
        entityId: "prod-001",
        newData: JSON.stringify({ name: "Excavator Model X" }),
      },
      {
        tenantId: org.id,
        userId: user?.id,
        action: "UPDATE_INVOICE",
        entityType: "Invoice",
        entityId: "inv-1002",
        oldData: JSON.stringify({ status: "DRAFT" }),
        newData: JSON.stringify({ status: "ISSUED" }),
      },
      {
        tenantId: org.id,
        userId: user?.id,
        action: "DELETE_ROLE",
        entityType: "Role",
        entityId: "role-99",
      },
    ],
  });

  // 3. System Metrics
  console.log("Seeding System Metrics...");
  await prisma.systemMetric.createMany({
    data: [
      { tenantId: org.id, metricName: "CPU_USAGE", metricValue: 45.2, unit: "%" },
      { tenantId: org.id, metricName: "CPU_USAGE", metricValue: 88.5, unit: "%" },
      { tenantId: org.id, metricName: "HTTP_LATENCY", metricValue: 120, unit: "ms" },
      { tenantId: org.id, metricName: "HTTP_LATENCY", metricValue: 450, unit: "ms" },
      { tenantId: org.id, metricName: "ACTIVE_CONNECTIONS", metricValue: 1050, unit: "count" },
    ],
  });

  // 4. Resilience (Failures & Retries)
  console.log("Seeding Resilience Data...");
  await prisma.failureEvent.createMany({
    data: [
      {
        tenantId: org.id,
        serviceName: "PaymentGateway",
        errorType: "TimeoutError",
        message: "Connection to Stripe timed out",
        isResolved: false,
      },
      {
        tenantId: org.id,
        serviceName: "EmailService",
        errorType: "SendGridError",
        message: "API Key Expired",
        isResolved: true,
        resolvedAt: new Date(),
      },
    ],
  });

  await prisma.retryQueue.createMany({
    data: [
      {
        tenantId: org.id,
        jobType: "SEND_WEBHOOK",
        payload: JSON.stringify({ event: "invoice.paid" }),
        status: "PENDING",
        attempts: 1,
        nextRetryAt: new Date(Date.now() + 60000),
      },
      {
        tenantId: org.id,
        jobType: "SYNC_ERP",
        payload: JSON.stringify({ entity: "Product" }),
        status: "FAILED_PERMANENTLY",
        attempts: 3,
        lastError: "SAP API unreachable",
        nextRetryAt: new Date(),
      },
    ],
  });

  // 5. Compliance Records
  console.log("Seeding Compliance Data...");
  await prisma.complianceRecord.createMany({
    data: [
      {
        tenantId: org.id,
        reportType: "SOC2_ACCESS_REVIEW",
        summary: "Quarterly user access review",
        reportData: JSON.stringify({ issuesFound: 2, status: "NEEDS_ATTENTION" }),
        periodStart: new Date("2025-01-01"),
        periodEnd: new Date("2025-03-31"),
        generatedBy: user?.id,
      },
      {
        tenantId: org.id,
        reportType: "GDPR_DATA_AUDIT",
        summary: "Annual PII data audit",
        reportData: JSON.stringify({ status: "COMPLIANT" }),
        periodStart: new Date("2024-01-01"),
        periodEnd: new Date("2024-12-31"),
        generatedBy: user?.id,
      },
    ],
  });

  console.log("Security & Observability Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
