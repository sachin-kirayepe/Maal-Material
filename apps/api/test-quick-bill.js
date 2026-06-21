const { PrismaClient } = require("@prisma/client");
const http = require("http");

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst();
  const shop = await prisma.shop.findFirst({ where: { name: "Shree Ram Hardware & Paints" } });
  const customer = await prisma.customer.findFirst();

  if (!user || !shop || !customer) {
    console.log("No user, shop or customer found");
    return;
  }

  const data = JSON.stringify({
    tenantId: shop.tenantId,
    shopId: shop.id,
    userId: user.id,
    customerId: customer.id,
    amountPaid: 500,
    paymentMode: "CASH",
    items: [{ productId: "test-product-id-mock", quantity: 2, unitPrice: 250 }],
  });

  const options = {
    hostname: "localhost",
    port: 3001,
    path: "/api/v1/simplified-workflows/quick-bill",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let resData = "";
    res.on("data", (d) => (resData += d));
    res.on("end", () => {
      console.log("Status Code:", res.statusCode);
      console.log("Response:", JSON.parse(resData));
    });
  });

  req.on("error", (error) => console.error(error));
  req.write(data);
  req.end();
}

run();
