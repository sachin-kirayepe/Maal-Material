import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mobile & Field Operations Data...");

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error("No tenant found. Run seed-erp.ts first.");
    return;
  }

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found for tenant.");
    return;
  }

  // 1. Create Mobile Devices
  console.log("Seeding Mobile Devices...");
  const device1 = await prisma.mobileDevice.create({
    data: {
      tenantId: tenant.id,
      deviceUuid: "IMEI-987654321012345",
      name: "Warehouse Scanner 01",
      os: "Android",
      osVersion: "13",
      appVersion: "2.4.1",
      status: "ACTIVE",
      batteryLevel: 85,
    },
  });

  const device2 = await prisma.mobileDevice.create({
    data: {
      tenantId: tenant.id,
      deviceUuid: "MAC-A1:B2:C3:D4:E5:F6",
      name: "Field Tablet Pro",
      os: "iOS",
      osVersion: "17.2",
      appVersion: "2.4.1",
      status: "ACTIVE",
      batteryLevel: 42,
    },
  });

  // 2. Create Active Mobile Session
  console.log("Seeding Mobile Sessions...");
  await prisma.mobileSession.create({
    data: {
      tenantId: tenant.id,
      deviceId: device1.id,
      userId: user.id,
      sessionToken: "m_sess_894hf498hf489h",
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 86400000), // +1 day
    },
  });

  // 3. Create Field Tasks
  console.log("Seeding Field Tasks...");
  await prisma.fieldTask.createMany({
    data: [
      {
        tenantId: tenant.id,
        assignedTo: user.id,
        taskType: "DELIVERY",
        status: "IN_PROGRESS",
        priority: "HIGH",
        payload: JSON.stringify({ deliveryId: "DEL-10492", address: "123 Site Avenue" }),
      },
      {
        tenantId: tenant.id,
        assignedTo: user.id,
        taskType: "INVENTORY_COUNT",
        status: "PENDING",
        priority: "NORMAL",
        payload: JSON.stringify({ zoneId: "ZONE-A", bin: "A-14" }),
      },
    ],
  });

  // 4. Create Sync Queue & Conflicts
  console.log("Seeding Sync Queues & Conflicts...");
  const queue1 = await prisma.offlineSyncQueue.create({
    data: {
      tenantId: tenant.id,
      deviceId: device1.id,
      userId: user.id,
      operationType: "UPDATE_INVENTORY",
      entityName: "StockItem",
      entityId: "item-991",
      payload: JSON.stringify({ quantity: 45 }),
      status: "CONFLICT",
      clientTime: new Date(Date.now() - 3600000), // 1 hour ago
    },
  });

  await prisma.syncConflict.create({
    data: {
      tenantId: tenant.id,
      queueId: queue1.id,
      entityName: "StockItem",
      entityId: "item-991",
      clientPayload: JSON.stringify({ quantity: 45 }),
      serverPayload: JSON.stringify({ quantity: 12 }),
      status: "UNRESOLVED",
    },
  });

  await prisma.offlineSyncQueue.create({
    data: {
      tenantId: tenant.id,
      deviceId: device2.id,
      userId: user.id,
      operationType: "CONSUME_MATERIAL",
      entityName: "Material",
      payload: JSON.stringify({ material: "Cement", qty: 10 }),
      status: "SUCCESS",
      clientTime: new Date(Date.now() - 7200000), // 2 hours ago
    },
  });

  // 5. Create Audit Log
  await prisma.syncAuditLog.create({
    data: {
      tenantId: tenant.id,
      deviceId: device1.id,
      userId: user.id,
      syncSessionId: "sync_9948fj3",
      recordsPushed: 14,
      recordsPulled: 42,
      conflictsFound: 1,
      durationMs: 432,
      status: "SUCCESS",
    },
  });

  console.log("Mobile & Sync Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
