const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedProcurement() {
  console.log("🏗️  Seeding Procurement & Supply Chain data...");

  // Create suppliers
  const suppliers = [
    {
      name: "Ambuja Cements Ltd",
      companyName: "Ambuja Cements",
      mobile: "9876543210",
      email: "orders@ambuja.com",
      gstin: "09AADCA1234A1Z5",
      supplierType: "MANUFACTURER",
      paymentTerms: "NET_30",
      creditLimit: 500000,
    },
    {
      name: "Tata Steel Distributors",
      companyName: "Tata Steel",
      mobile: "9876543211",
      email: "supply@tatasteel.com",
      gstin: "09AADCT5678B2Z3",
      supplierType: "DISTRIBUTOR",
      paymentTerms: "NET_45",
      creditLimit: 1000000,
    },
    {
      name: "Hindustan Hardware",
      companyName: "HH Supplies",
      mobile: "9876543212",
      email: "info@hhsupplies.com",
      gstin: "09BBHHS9012C3Z1",
      supplierType: "WHOLESALE",
      paymentTerms: "NET_15",
      creditLimit: 200000,
    },
    {
      name: "Gorakhpur Sand & Gravel",
      mobile: "9876543213",
      supplierType: "LOCAL_VENDOR",
      paymentTerms: "IMMEDIATE",
      creditLimit: 50000,
    },
    {
      name: "Birla White Cement",
      companyName: "Birla Corp",
      mobile: "9876543214",
      email: "sales@birla.com",
      gstin: "09CCBWC3456D4Z2",
      supplierType: "MANUFACTURER",
      paymentTerms: "NET_60",
      creditLimit: 750000,
    },
  ];

  for (const s of suppliers) {
    const exists = await prisma.supplier.findFirst({ where: { mobile: s.mobile } });
    if (!exists) {
      await prisma.supplier.create({
        data: {
          ...s,
          addresses: {
            create: [
              {
                addressLine: "Industrial Area, Sector 5",
                city: "Gorakhpur",
                state: "Uttar Pradesh",
                pincode: "273001",
                isDefault: true,
              },
            ],
          },
          supplierLedger: { create: { balance: 0 } },
        },
      });
      console.log(`  ✅ Supplier: ${s.name}`);
    }
  }

  // Seed procurement permissions
  const procurementPermissions = [
    "suppliers:create",
    "suppliers:read",
    "suppliers:update",
    "suppliers:delete",
    "purchases:create",
    "purchases:read",
    "purchases:update",
    "purchases:approve",
    "grn:create",
    "grn:read",
    "procurement:create",
    "procurement:read",
    "procurement:approve",
  ];

  for (const action of procurementPermissions) {
    const exists = await prisma.permission.findFirst({ where: { action } });
    if (!exists) {
      await prisma.permission.create({ data: { action, description: `Procurement: ${action}` } });
      console.log(`  🔑 Permission: ${action}`);
    }
  }

  // Assign permissions to SUPER_ADMIN role
  const adminRole = await prisma.role.findFirst({ where: { name: "SUPER_ADMIN" } });
  if (adminRole) {
    const allPerms = await prisma.permission.findMany({
      where: { action: { in: procurementPermissions } },
    });
    for (const p of allPerms) {
      const exists = await prisma.rolePermission.findFirst({
        where: { roleId: adminRole.id, permissionId: p.id },
      });
      if (!exists) {
        await prisma.rolePermission.create({ data: { roleId: adminRole.id, permissionId: p.id } });
      }
    }
    console.log("  🛡️  Procurement permissions assigned to SUPER_ADMIN");
  }

  console.log("✅ Procurement seed complete!");
}

seedProcurement()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
