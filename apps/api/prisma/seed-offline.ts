import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Offline and Resilience Infrastructure...");

  const tenantId = "t-001";

  // Create an Offline Device
  const device = await prisma.offlineDevice.create({
    data: {
      id: "device-offline-123",
      tenantId,
      deviceName: "Samsung Galaxy M32 (Site Supervisor)",
      networkStatus: "OFFLINE",
    },
  });

  // Create Network Analytics data
  await prisma.networkConditionAnalytics.createMany({
    data: [
      {
        deviceId: device.id,
        connectionType: "3G",
        latencyMs: 850,
        packetLoss: 0.1,
      },
      {
        deviceId: device.id,
        connectionType: "OFFLINE",
        latencyMs: 0,
        packetLoss: 1.0,
      },
    ],
  });

  // Add items to the Offline Queue
  const queue1 = await prisma.offlineQueue.create({
    data: {
      tenantId,
      deviceId: device.id,
      operation: "CREATE_INVOICE",
      payload: JSON.stringify({ amount: 1500, customerName: "Raju Bhai" }),
      status: "PENDING",
    },
  });

  const queue2 = await prisma.offlineQueue.create({
    data: {
      tenantId,
      deviceId: device.id,
      operation: "UPDATE_STOCK",
      payload: JSON.stringify({ itemCode: "CEMENT-ACC", quantity: -5 }),
      status: "PENDING",
    },
  });

  const syncOp = await prisma.syncOperation.create({
    data: {
      queueId: queue2.id,
      status: "CONFLICT",
    },
  });

  // Create a Conflict Resolution
  await prisma.conflictResolution.create({
    data: {
      syncOpId: syncOp.id,
      entityType: "StockItem",
      entityId: "CEMENT-ACC",
      serverData: JSON.stringify({ quantity: 0 }),
      localData: JSON.stringify({ quantity: -5 }),
      resolution: "PENDING",
    },
  });

  // Create WhatsApp Workflows
  await prisma.whatsAppWorkflow.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        tenantId,
        shopId: "shop-001",
        phoneNumber: "+919876543210",
        workflowType: "QUOTATION",
        status: "SENT",
        contextPayload: JSON.stringify({ amount: 45000, items: ["TMT Bars", "Cement"] }),
      },
      {
        id: crypto.randomUUID(),
        tenantId,
        shopId: "shop-001",
        phoneNumber: "+918765432109",
        workflowType: "INVOICE",
        status: "COMPLETED",
        contextPayload: JSON.stringify({ amount: 12500 }),
      },
    ],
  });

  console.log("Offline Data Seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
