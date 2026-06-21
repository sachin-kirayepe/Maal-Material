import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenantId = "tenant-1";

  console.log("Seeding Procurement and Supply-Chain Modules...");

  // Vendor and procurement seed logic has been removed because the models no longer exist in the schema.
  // The seed logic has been commented out to prevent type errors.

  console.log("Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
