import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Realtime & Event Data...");

  // 1. Fetch a User and a Tenant
  const user = await prisma.user.findFirst();
  const tenant = await prisma.tenant.findFirst();

  if (!user || !tenant) {
    console.error("Missing User or Tenant. Please run seed-erp.ts first.");
    return;
  }

  // 2. Generate Notification Preferences
  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      email: true,
      inApp: true,
      push: true,
    },
  });

  // 3. Generate 10 Notifications
  const notifications = [
    {
      title: "Order Confirmed",
      body: "Order ORD-123456 has been confirmed.",
      type: "ALERT",
      priority: "HIGH",
      actionUrl: "/orders",
      isRead: false,
    },
    {
      title: "Payment Received",
      body: "Payment of $5,000 received for Invoice INV-999.",
      type: "SYSTEM",
      priority: "NORMAL",
      actionUrl: "/ledger",
      isRead: true,
      readAt: new Date(),
    },
    {
      title: "Low Stock Warning",
      body: "Portland Cement is below minimum threshold.",
      type: "ALERT",
      priority: "URGENT",
      actionUrl: "/inventory",
      isRead: false,
    },
    {
      title: "Delivery Dispatched",
      body: "Delivery DEL-777 is out for delivery.",
      type: "SYSTEM",
      priority: "NORMAL",
      actionUrl: "/logistics/deliveries",
      isRead: false,
    },
    {
      title: "New Worker Added",
      body: "Ramesh Singh was added to Metro Line 4.",
      type: "MESSAGE",
      priority: "LOW",
      actionUrl: "/projects/workers",
      isRead: true,
      readAt: new Date(),
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        ...n,
      },
    });
  }
  console.log("Inserted Notifications");

  // 4. Generate Activity Logs
  const activities = [
    {
      action: "ORDER_CREATED",
      entityType: "Order",
      entityId: "ORD-123456",
      metadata: JSON.stringify({ amount: 15000 }),
    },
    {
      action: "STOCK_REDUCED",
      entityType: "WarehouseStock",
      entityId: "WS-001",
      metadata: JSON.stringify({ product: "Cement", qty: 50 }),
    },
    {
      action: "WORKER_ATTENDANCE",
      entityType: "Attendance",
      entityId: "ATT-100",
      metadata: JSON.stringify({ status: "PRESENT" }),
    },
    {
      action: "MATERIAL_CONSUMED",
      entityType: "MaterialConsumption",
      entityId: "MC-200",
      metadata: JSON.stringify({ cost: 5000 }),
    },
    {
      action: "INVOICE_PAID",
      entityType: "Invoice",
      entityId: "INV-999",
      metadata: JSON.stringify({ mode: "BANK_TRANSFER" }),
    },
  ];

  for (const act of activities) {
    await prisma.activityLog.create({
      data: {
        tenantId: tenant.id,
        actorId: user.id,
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        ...act,
      },
    });
  }
  console.log("Inserted Activity Logs");

  // 5. Generate System Events (Simulating Event Sourcing)
  for (let i = 0; i < 3; i++) {
    await prisma.systemEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "order.created",
        payload: JSON.stringify({ orderId: "ORD-123", amount: 500 }),
        status: "PROCESSED",
        processedAt: new Date(),
      },
    });
  }
  console.log("Inserted System Events");

  console.log("Realtime & Event Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
