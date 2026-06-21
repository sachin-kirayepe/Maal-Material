import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--------------------------------------------------");
  console.log("Maal-Material Logistics Data Seeder Hydration");
  console.log("--------------------------------------------------");

  // Get first tenant to attach records
  const tenant = await prisma.tenant.findFirst({ where: { status: "ACTIVE" } });
  if (!tenant) throw new Error("No active tenant found to bind logistics data to.");

  // 1. Seed Shipping Zones
  console.log("Seeding Shipping Zones...");
  const zonesData = [
    {
      name: "Gorakhpur Local",
      code: "GKP-LCL",
      cities: "Gorakhpur",
      state: "UP",
      baseCost: 500,
      perKmCost: 15,
      estimatedDays: 1,
    },
    {
      name: "Eastern UP Region",
      code: "EUP-REG",
      cities: "Deoria, Kushinagar, Basti, Maharajganj",
      state: "UP",
      baseCost: 1500,
      perKmCost: 12,
      estimatedDays: 2,
    },
    {
      name: "Lucknow Metro",
      code: "LKO-MET",
      cities: "Lucknow, Unnao, Barabanki",
      state: "UP",
      baseCost: 800,
      perKmCost: 18,
      estimatedDays: 1,
    },
    {
      name: "Varanasi Region",
      code: "VNS-REG",
      cities: "Varanasi, Mirzapur, Ghazipur",
      state: "UP",
      baseCost: 1200,
      perKmCost: 15,
      estimatedDays: 2,
    },
  ];

  const zones: any[] = [];
  for (const z of zonesData) {
    const zone = await prisma.shippingZone.upsert({
      where: { code: z.code },
      update: {},
      create: { ...z, tenantId: tenant.id },
    });
    zones.push(zone);
  }
  console.log(`Seeded ${zones.length} Shipping Zones.`);

  // 2. Seed Drivers
  console.log("Seeding Drivers...");
  const driversData = [
    {
      name: "Rajesh Kumar",
      mobile: "9876500001",
      licenseNumber: "UP53-DL-2015-1122",
      availabilityStatus: "AVAILABLE",
    },
    {
      name: "Amit Yadav",
      mobile: "9876500002",
      licenseNumber: "UP53-DL-2018-3344",
      availabilityStatus: "AVAILABLE",
    },
    {
      name: "Vikram Singh",
      mobile: "9876500003",
      licenseNumber: "UP32-DL-2016-5566",
      availabilityStatus: "ON_DELIVERY",
    },
    {
      name: "Manoj Chaurasia",
      mobile: "9876500004",
      licenseNumber: "UP65-DL-2019-7788",
      availabilityStatus: "OFF_DUTY",
    },
    {
      name: "Suresh Patel",
      mobile: "9876500005",
      licenseNumber: "UP53-DL-2020-9900",
      availabilityStatus: "AVAILABLE",
    },
  ];

  const drivers: any[] = [];
  for (const d of driversData) {
    const driver = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: {},
      create: { ...d, tenantId: tenant.id },
    });
    drivers.push(driver);
  }
  console.log(`Seeded ${drivers.length} Drivers.`);

  // 3. Seed Vehicles (Fleet)
  console.log("Seeding Fleet...");
  const fleetData = [
    {
      vehicleNumber: "UP-53-AT-9021",
      type: "TRUCK",
      make: "Tata",
      model: "LPT 1618",
      capacity: 10,
      operationalStatus: "ACTIVE",
    },
    {
      vehicleNumber: "UP-53-BT-1124",
      type: "TRUCK",
      make: "Ashok Leyland",
      model: "Ecomet",
      capacity: 8,
      operationalStatus: "ACTIVE",
    },
    {
      vehicleNumber: "UP-53-AT-4481",
      type: "MINI_TRUCK",
      make: "Tata",
      model: "407",
      capacity: 2.5,
      operationalStatus: "ACTIVE",
    },
    {
      vehicleNumber: "UP-53-CT-8890",
      type: "TRUCK",
      make: "Tata",
      model: "Signa",
      capacity: 20,
      operationalStatus: "MAINTENANCE",
    },
    {
      vehicleNumber: "UP-32-BZ-3321",
      type: "PICKUP",
      make: "Mahindra",
      model: "Bolero Pik-Up",
      capacity: 1.5,
      operationalStatus: "ACTIVE",
    },
    {
      vehicleNumber: "UP-65-AZ-7766",
      type: "AUTO",
      make: "Piaggio",
      model: "Ape",
      capacity: 0.5,
      operationalStatus: "ACTIVE",
    },
  ];

  const vehicles: any[] = [];
  for (const v of fleetData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { vehicleNumber: v.vehicleNumber },
      update: {},
      create: { ...v, tenantId: tenant.id },
    });
    vehicles.push(vehicle);
  }
  console.log(`Seeded ${vehicles.length} Vehicles.`);

  console.log("==================================================");
  console.log("Logistics Data Seeding COMPLETE!");
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("Critical error during logistics seeder execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
