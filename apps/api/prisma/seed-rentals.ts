import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Construction Equipment Rental data...");
  const tenantId = "t-001";
  const ownerId = "VEND-RENTALS-01";

  // 1. Create Equipment Assets
  await prisma.equipmentAsset.create({
    data: {
      tenantId,
      ownerId,
      name: "CAT 320 Excavator",
      category: "HEAVY_MACHINERY",
      model: "320D",
      status: "AVAILABLE",
      location: "Mumbai Yard",
      pricing: {
        create: {
          dailyRate: 15000,
          hourlyRate: 2000,
          operatorCharge: 1500,
          depositAmount: 50000,
        },
      },
    },
  });

  const eq2 = await prisma.equipmentAsset.create({
    data: {
      tenantId,
      ownerId,
      name: "JCB 3DX Backhoe Loader",
      category: "HEAVY_MACHINERY",
      model: "3DX",
      status: "RENTED",
      location: "Pune Construction Site A",
      pricing: {
        create: {
          dailyRate: 8000,
          hourlyRate: 1200,
          operatorCharge: 1000,
          depositAmount: 30000,
        },
      },
    },
  });

  // 2. Create Bookings (Intent-based initially, then approved/locked)
  await prisma.rentalBooking.create({
    data: {
      tenantId,
      equipmentId: eq2.id,
      contractorId: "CONT-LARSEN",
      startDate: new Date("2026-06-05"),
      endDate: new Date("2026-06-15"),
      totalAmount: 80000,
      status: "APPROVED",
      operatorAssigned: true,
    },
  });

  // 3. Block Calendar Availability
  await prisma.equipmentAvailability.create({
    data: {
      tenantId,
      equipmentId: eq2.id,
      startDate: new Date("2026-06-05"),
      endDate: new Date("2026-06-15"),
      status: "BLOCKED",
      reason: "BOOKED",
    },
  });

  // 4. Fleet Operations & Analytics
  await prisma.fleetOperation.create({
    data: {
      tenantId,
      ownerId,
      totalAssets: 45,
      activeRentals: 32,
      inMaintenance: 4,
      utilizationRate: 71.1,
    },
  });

  await prisma.fleetAnalytics.createMany({
    data: [
      { tenantId, fleetOwnerId: ownerId, metricKey: "REVENUE_30D", metricValue: 1420000 },
      { tenantId, fleetOwnerId: ownerId, metricKey: "UTILIZATION_RATE", metricValue: 71.1 },
    ],
  });

  console.log("Construction Equipment Rental Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
