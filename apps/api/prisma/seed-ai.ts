import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Enterprise AI Data...");

  // Get first tenant
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error("No tenant found. Run seed-erp.ts first.");
    return;
  }
  const tenantId = tenant.id;

  // 1. AI Insights
  await prisma.aiInsight.createMany({
    data: [
      {
        tenantId,
        type: "INVENTORY",
        title: "Projected Stockout: High-Grade Cement",
        description: "Based on current burn rate at Site A, cement will run out in 3 days.",
        confidence: 0.89,
        metrics: JSON.stringify({ burnRate: 150, currentStock: 400 }),
      },
      {
        tenantId,
        type: "FINANCIAL",
        title: "Cashflow Optimization",
        description:
          "Delaying payment to Supplier X by 5 days aligns better with incoming receivables without incurring penalties.",
        confidence: 0.95,
        metrics: JSON.stringify({ savingPotential: 1200 }),
      },
    ],
  });

  // 2. Recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        tenantId,
        domain: "PROCUREMENT",
        action: "RESTOCK",
        description: "Reorder 500 bags of High-Grade Cement from standard supplier.",
        priority: "CRITICAL",
        status: "PENDING",
        contextData: JSON.stringify({ productId: "cement-uuid" }),
      },
      {
        tenantId,
        domain: "LOGISTICS",
        action: "REROUTE_DISPATCH",
        description: "Reroute Delivery #4023 to avoid heavy traffic on I-95.",
        priority: "MEDIUM",
        status: "PENDING",
      },
    ],
  });

  // 3. Automation Workflows
  const wf = await prisma.automationWorkflow.create({
    data: {
      tenantId,
      name: "Low Stock Alert & Auto-PO",
      description: "Triggers when stock < minLevel. Generates Draft PO and Alerts Manager.",
      triggerType: "EVENT",
      triggerData: JSON.stringify({ eventName: "stock.updated" }),
      actions: JSON.stringify([{ type: "CREATE_PO", autoSubmit: false }, { type: "SEND_ALERT" }]),
      isActive: true,
    },
  });

  // 4. Workflow Executions
  await prisma.workflowExecution.create({
    data: {
      workflowId: wf.id,
      tenantId,
      status: "SUCCESS",
      logs: JSON.stringify([
        { step: "Evaluating condition", status: "true" },
        { step: "Generating PO", status: "Drafted" },
      ]),
    },
  });

  // 5. Operational Alerts
  await prisma.operationalAlert.createMany({
    data: [
      {
        tenantId,
        type: "OVERDUE_PAYMENT",
        severity: "WARNING",
        message: "Invoice INV-1004 is 7 days overdue from Client TechBuild.",
        source: "FINANCE_ENGINE",
      },
      {
        tenantId,
        type: "CONTRACTOR_RISK",
        severity: "CRITICAL",
        message: "Contractor XYZ has a 40% no-show rate this week.",
        source: "ATTENDANCE_ENGINE",
      },
    ],
  });

  // 6. Copilot Conversation
  const user = await prisma.user.findFirst();
  if (user) {
    await prisma.copilotConversation.create({
      data: {
        tenantId,
        userId: user.id,
        title: "Project Efficiency Analysis",
        history: JSON.stringify([
          { role: "user", content: "What is the biggest inefficiency at Site A?" },
          {
            role: "assistant",
            content:
              "The biggest inefficiency is material staging. Concrete mixers are waiting idle for an average of 45 minutes.",
          },
        ]),
      },
    });
  }

  // 7. AI Action Logs
  await prisma.aiActionLog.createMany({
    data: [
      {
        tenantId,
        actionType: "SYSTEM_OPTIMIZATION",
        description: "Auto-scaled cache for BI dashboard due to high load.",
        status: "SUCCESS",
      },
      {
        tenantId,
        actionType: "WORKFLOW_RECOMMENDATION",
        description: "Generated new routing rules for dispatch.",
        status: "SUCCESS",
      },
    ],
  });

  console.log("AI Data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
