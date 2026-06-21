const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testCopilot() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  console.log("Using tenant:", tenant.id);

  const payload = {
    message:
      "Calculate the total cost of 50 bags of cement if 1 bag is 400 Rs and add 18% GST. Just give me the total number.",
  };

  const res = await fetch("http://localhost:3001/api/v1/copilot/conversations/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer DUMMY_TOKEN",
      "x-tenant-id": tenant.id,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("Response Status:", res.status);
  console.log("Response Body:", text);

  const convs = await prisma.copilotConversation.findMany();
  console.log("Saved Conversations in DB:", JSON.stringify(convs, null, 2));
}

testCopilot().finally(() => prisma.$disconnect());
