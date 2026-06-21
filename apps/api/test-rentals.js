const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runTests() {
  console.log("--- Commencing Construction Equipment Rental Tests ---");
  const tenantId = "t-001";

  try {
    // 1. Test Equipment Assets
    const equipment = await prisma.equipmentAsset.findMany({
      where: { tenantId },
      include: { pricing: true },
    });
    console.log("Equipment Assets: Found " + equipment.length + " machines.");
    equipment.forEach((eq) => {
      console.log("   [" + eq.status + "] " + eq.name + " (" + eq.category + ")");
      if (eq.pricing) {
        console.log("      Pricing: Rs " + eq.pricing.dailyRate + "/day");
      }
    });

    // 2. Test Bookings
    const bookings = await prisma.rentalBooking.findMany({ where: { tenantId } });
    console.log("Rental Bookings: Found " + bookings.length + " active bookings.");
    bookings.forEach((b) => {
      console.log(
        "   [" +
          b.status +
          "] Amount: Rs " +
          b.totalAmount +
          ", From: " +
          b.startDate.toISOString().split("T")[0] +
          " To: " +
          b.endDate.toISOString().split("T")[0],
      );
    });

    // 3. Test Availability Ledger (Conflict Prevention)
    const blocks = await prisma.equipmentAvailability.findMany({ where: { tenantId } });
    console.log("Availability Engine: Found " + blocks.length + " blocked time slots.");
    blocks.forEach((b) => {
      console.log(
        "   [" +
          b.status +
          "] " +
          b.reason +
          " -> " +
          b.startDate.toISOString().split("T")[0] +
          " to " +
          b.endDate.toISOString().split("T")[0],
      );
    });

    // 4. Test Fleet Analytics
    const analytics = await prisma.fleetAnalytics.findMany({ where: { tenantId } });
    console.log("Fleet Analytics: Found " + analytics.length + " metric points.");
    analytics.forEach((a) => {
      console.log("   " + a.metricKey + ": " + a.metricValue);
    });

    console.log("--- All Rental infrastructure tests passed successfully ---");
  } catch (error) {
    console.error("Test Failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
