import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDb() {
  const count = await prisma.customer.count();
  console.log('Total customers in DB:', count);
  
  const allCustomers = await prisma.customer.findMany({
    select: { id: true, name: true, tenantId: true, deletedAt: true }
  });
  console.log('All customers:', JSON.stringify(allCustomers, null, 2));
}

checkDb().catch(console.error).finally(() => prisma.$disconnect());
