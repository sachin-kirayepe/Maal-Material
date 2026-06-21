const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOMS() {
  console.log("📦 Seeding Order Management System (OMS) data...");

  // 1. Get an existing customer and user
  const customer = await prisma.customer.findFirst();
  const user = await prisma.user.findFirst();
  const warehouse = await prisma.warehouse.findFirst();
  const products = await prisma.product.findMany({ take: 3 });

  if (!customer || !user || !warehouse || products.length < 3) {
    console.error(
      "Missing prerequisite data (Customer, User, Warehouse, Products). Run core seeds first.",
    );
    return;
  }

  // 2. Create Order Address
  const shippingAddress = await prisma.orderAddress.create({
    data: {
      customerId: customer.id,
      addressLine: "123 Commerce St, Suite 400",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      isDefault: true,
    },
  });

  // 3. Create an Order
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: customer.id,
      warehouseId: warehouse.id,
      subtotal: 15000,
      taxAmount: 2700,
      discount: 500,
      shippingCost: 200,
      grandTotal: 17400,
      orderStatus: "PENDING",
      paymentStatus: "UNPAID",
      fulfillmentStatus: "UNFULFILLED",
      shippingAddressId: shippingAddress.id,
      billingAddressId: shippingAddress.id,
      createdBy: user.id,
      items: {
        create: [
          {
            productId: products[0].id,
            productName: products[0].name,
            sku: products[0].sku,
            orderedQty: 10,
            unitPrice: 500,
            taxPercent: 18,
            taxAmount: 900,
            totalAmount: 5900,
          },
          {
            productId: products[1].id,
            productName: products[1].name,
            sku: products[1].sku,
            orderedQty: 20,
            unitPrice: 500,
            taxPercent: 18,
            taxAmount: 1800,
            totalAmount: 11800,
          },
        ],
      },
      timeline: {
        create: {
          status: "PENDING",
          description: "Order created via Seed",
          createdBy: user.id,
        },
      },
    },
  });

  console.log(`✅ Created Order: ${order.orderNumber}`);

  console.log("🎉 OMS seeding complete!");
}

seedOMS()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
