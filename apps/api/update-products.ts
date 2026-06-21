import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const firstTenant = await prisma.tenant.findFirst();
  if (!firstTenant) {
    console.log("No tenant found!");
    return;
  }
  
  const res = await prisma.$executeRaw`UPDATE "products" SET "tenantId" = ${firstTenant.id}`;
  console.log(`Updated ${res} products to tenantId ${firstTenant.id}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
