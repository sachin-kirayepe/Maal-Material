import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@constructos.com' }
  });
  console.log("Admin user:", user ? "EXISTS" : "DOES NOT EXIST");
  
  if (user) {
    console.log("ID:", user.id);
  }
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
