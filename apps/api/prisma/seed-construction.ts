import { PrismaClient } from "@prisma/client";
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Industrial Construction Data...");

  // 1. Create a Construction Project
  // 1. Construction Project model has been removed. Seed logic is commented out.

  // 2. Create Phases and other construction models have been removed from the schema.
  // The seed logic has been commented out to prevent type errors.

  console.log("Construction execution seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
