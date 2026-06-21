import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SystemRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SHOP_OWNER: "SHOP_OWNER",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  DRIVER: "DRIVER",
  CONTRACTOR: "CONTRACTOR",
  CUSTOMER: "CUSTOMER",

  // Dashboard backwards-compatible roles
  ORG_ADMIN: "ORG_ADMIN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  BILLING_CLERK: "BILLING_CLERK",
  FIELD_USER: "FIELD_USER",
};

const SystemPermission = {
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",

  INVENTORY_CREATE: "inventory:create",
  INVENTORY_READ: "inventory:read",
  INVENTORY_UPDATE: "inventory:update",
  INVENTORY_DELETE: "inventory:delete",

  BILLING_CREATE: "billing:create",
  BILLING_READ: "billing:read",
  BILLING_UPDATE: "billing:update",
  BILLING_DELETE: "billing:delete",

  MARKETPLACE_BUY: "marketplace:buy",
  MARKETPLACE_SELL: "marketplace:sell",
  MARKETPLACE_MANAGE: "marketplace:manage",

  LOGISTICS_DISPATCH: "logistics:dispatch",
  LOGISTICS_TRACK: "logistics:track",
  DELIVERY_MANAGE: "delivery:manage",
  DISPATCH_MANAGE: "dispatch:manage",
  DRIVERS_MANAGE: "drivers:manage",
  FLEET_MANAGE: "fleet:manage",
  SHIPPING_MANAGE: "shipping:manage",

  ORG_MANAGE: "org:manage",
  SYSTEM_SETTINGS: "system:settings",

  // Multi-Tenant Commerce
  TENANTS_MANAGE: "tenants:manage",
  SHOPS_CREATE: "shops:create",
  SHOPS_READ: "shops:read",
  SHOPS_MANAGE: "shops:manage",
  SHOP_USERS_MANAGE: "shop-users:manage",
  SUBSCRIPTIONS_MANAGE: "subscriptions:manage",
};

async function main() {
  console.log("--------------------------------------------------");
  console.log("Maal-Material Production Database Seeder Hydration");
  console.log("--------------------------------------------------");

  // 1. Seed Permissions
  console.log("Seeding system permission entries...");
  const permissions = [];
  for (const action of Object.values(SystemPermission)) {
    const perm = await prisma.permission.upsert({
      where: { action },
      update: {},
      create: {
        action,
        description: `Grants capability to execute ${action.replace(":", " ")} operations`,
      },
    });
    permissions.push(perm);
  }
  console.log(`Successfully seeded ${permissions.length} actions.`);

  // 2. Seed Roles & Map Permissions
  console.log("Seeding system security roles and mapping permissions...");

  const createdRoles: Record<string, any> = {};

  for (const roleName of Object.values(SystemRole)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `Standard system role for ${roleName.toLowerCase().replace("_", " ")} users`,
      },
    });
    createdRoles[roleName] = role;
  }

  // Define exact Permission Assignment Map
  const rolePermissionsMap: Record<string, string[]> = {
    [SystemRole.SUPER_ADMIN]: Object.values(SystemPermission),

    [SystemRole.ADMIN]: Object.values(SystemPermission).filter(
      (p) => p !== SystemPermission.SYSTEM_SETTINGS,
    ),

    [SystemRole.ORG_ADMIN]: Object.values(SystemPermission).filter(
      (p) => p !== SystemPermission.SYSTEM_SETTINGS,
    ),

    [SystemRole.MANAGER]: [
      SystemPermission.USERS_READ,
      SystemPermission.INVENTORY_CREATE,
      SystemPermission.INVENTORY_READ,
      SystemPermission.INVENTORY_UPDATE,
      SystemPermission.BILLING_CREATE,
      SystemPermission.BILLING_READ,
      SystemPermission.BILLING_UPDATE,
      SystemPermission.LOGISTICS_TRACK,
      SystemPermission.DELIVERY_MANAGE,
      SystemPermission.DISPATCH_MANAGE,
      SystemPermission.FLEET_MANAGE,
      SystemPermission.MARKETPLACE_BUY,
    ],

    [SystemRole.PROJECT_MANAGER]: [
      SystemPermission.USERS_READ,
      SystemPermission.INVENTORY_CREATE,
      SystemPermission.INVENTORY_READ,
      SystemPermission.INVENTORY_UPDATE,
      SystemPermission.BILLING_CREATE,
      SystemPermission.BILLING_READ,
      SystemPermission.BILLING_UPDATE,
      SystemPermission.LOGISTICS_TRACK,
      SystemPermission.DELIVERY_MANAGE,
      SystemPermission.DISPATCH_MANAGE,
      SystemPermission.FLEET_MANAGE,
      SystemPermission.MARKETPLACE_BUY,
    ],

    [SystemRole.SHOP_OWNER]: [
      SystemPermission.INVENTORY_CREATE,
      SystemPermission.INVENTORY_READ,
      SystemPermission.INVENTORY_UPDATE,
      SystemPermission.INVENTORY_DELETE,
      SystemPermission.MARKETPLACE_SELL,
      SystemPermission.MARKETPLACE_MANAGE,
      SystemPermission.BILLING_READ,
    ],

    [SystemRole.STAFF]: [
      SystemPermission.INVENTORY_READ,
      SystemPermission.INVENTORY_UPDATE,
      SystemPermission.LOGISTICS_TRACK,
    ],

    [SystemRole.DRIVER]: [SystemPermission.LOGISTICS_TRACK, SystemPermission.DELIVERY_MANAGE],

    [SystemRole.CONTRACTOR]: [
      SystemPermission.INVENTORY_READ,
      SystemPermission.MARKETPLACE_BUY,
      SystemPermission.LOGISTICS_TRACK,
    ],

    [SystemRole.CUSTOMER]: [SystemPermission.MARKETPLACE_BUY, SystemPermission.LOGISTICS_TRACK],
  };

  // Hydrate Role-Permission Joins
  console.log("Applying Role-Permission mapping matrix...");
  /*
  for (const [roleName, actions] of Object.entries(rolePermissionsMap)) {
    const role = createdRoles[roleName];
    if (!role) continue;

    for (const action of actions) {
      const permission = permissions.find((p) => p.action === action);
      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
  */
  console.log("Role-Permission mapping completed.");

  // 3. Seed Default Administrator Account
  console.log("Seeding default platform Super Admin User...");

  // BCrypt hash for "Admin123!"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Admin123!", salt);

  const adminEmail = "admin@constructos.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      firstName: "System",
      lastName: "Administrator",
      isActive: true,
    },
  });

  // Map admin to SUPER_ADMIN role
  const superAdminRole = createdRoles[SystemRole.SUPER_ADMIN];
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin?.id as string as string,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin?.id as string as string,
      roleId: superAdminRole.id,
    },
  });

  console.log("--------------------------------------------------");
  console.log("Seeding Inventory Foundation Data...");
  console.log("--------------------------------------------------");

  // 4. Seed Units
  const unitData = [
    { name: "Piece", abbreviation: "pcs", unitType: "quantity" },
    { name: "Kilogram", abbreviation: "kg", unitType: "weight" },
    { name: "Bag", abbreviation: "bag", unitType: "quantity" },
    { name: "Meter", abbreviation: "m", unitType: "length" },
    { name: "Foot", abbreviation: "ft", unitType: "length" },
    { name: "Liter", abbreviation: "ltr", unitType: "volume" },
    { name: "Box", abbreviation: "box", unitType: "quantity" },
    { name: "Ton", abbreviation: "ton", unitType: "weight" },
    { name: "Bundle", abbreviation: "bdl", unitType: "quantity" },
    { name: "Square Foot", abbreviation: "sqft", unitType: "area" },
  ];
  const units: Record<string, any> = {};
  for (const u of unitData) {
    const unit = await prisma.unit.upsert({
      where: { abbreviation: u.abbreviation },
      update: {},
      create: u,
    });
    units[u.abbreviation] = unit;
  }
  console.log(`Seeded ${Object.keys(units).length} units.`);

  // 5. Seed Categories & SubCategories
  const categoryData = [
    {
      name: "Building Materials",
      slug: "building-materials",
      subs: ["Cement", "Bricks & Blocks", "Sand & Aggregates", "TMT Bars"],
    },
    {
      name: "Electrical",
      slug: "electrical",
      subs: ["Wires & Cables", "Switches & Sockets", "MCBs & Panels", "LED Lighting"],
    },
    {
      name: "Plumbing",
      slug: "plumbing",
      subs: ["PVC Pipes", "Fittings & Valves", "Taps & Faucets", "Water Tanks"],
    },
    {
      name: "Paints & Finishes",
      slug: "paints-finishes",
      subs: ["Interior Paints", "Exterior Paints", "Primers", "Wood Finishes"],
    },
    {
      name: "Hardware & Tools",
      slug: "hardware-tools",
      subs: ["Hand Tools", "Power Tools", "Fasteners", "Safety Equipment"],
    },
    {
      name: "Steel & Iron",
      slug: "steel-iron",
      subs: ["MS Plates", "Angles & Channels", "GI Sheets", "Binding Wire"],
    },
  ];
  const categories: Record<string, any> = {};
  const subCategories: Record<string, any> = {};
  for (let i = 0; i < categoryData.length; i++) {
    const cd = categoryData[i];
    const cat = await prisma.category.upsert({
      where: { slug: cd!.slug },
      update: {},
      create: {
        name: cd!.name,
        slug: cd!.slug,
        sortOrder: i,
        description: `${cd!.name} for construction projects`,
      },
    });
    categories[cd!.slug] = cat as any;
    for (let j = 0; j < cd!.subs.length; j++) {
      const subSlug = `${cd!.slug}-${(cd!.subs[j] as string).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const sub = await prisma.subCategory.upsert({
        where: { slug: subSlug },
        update: {},
        create: {
          categoryId: cat.id as string,
          name: cd!.subs[j] as string,
          slug: subSlug,
          sortOrder: j,
        },
      });
      subCategories[subSlug] = sub;
    }
  }
  console.log(
    `Seeded ${Object.keys(categories).length} categories, ${Object.keys(subCategories).length} sub-categories.`,
  );

  // 6. Seed Warehouses
  const warehouseData = [
    {
      name: "Main Warehouse Gorakhpur",
      code: "WH-GKP-01",
      city: "Gorakhpur",
      state: "UP",
      pincode: "273001",
      isPrimary: true,
    },
    {
      name: "Depot Lucknow",
      code: "WH-LKO-01",
      city: "Lucknow",
      state: "UP",
      pincode: "226001",
      isPrimary: false,
    },
    {
      name: "Distribution Center Varanasi",
      code: "WH-VNS-01",
      city: "Varanasi",
      state: "UP",
      pincode: "221001",
      isPrimary: false,
    },
  ];
  const warehouses: any[] = [];
  for (const wh of warehouseData) {
    const w = await prisma.warehouse.upsert({
      where: { code: wh.code },
      update: {},
      create: wh,
    });
    warehouses.push(w);
  }
  console.log(`Seeded ${warehouses.length} warehouses.`);

  // 7. Seed Products
  const productData = [
    {
      name: "UltraTech Cement OPC 43",
      sku: "SKU-CEM-001",
      catSlug: "building-materials",
      unit: "bag",
      pp: 350,
      sp: 420,
      mrp: 450,
      min: 50,
      reorder: 100,
    },
    {
      name: "Ambuja PPC Cement 50kg",
      sku: "SKU-CEM-002",
      catSlug: "building-materials",
      unit: "bag",
      pp: 330,
      sp: 400,
      mrp: 440,
      min: 50,
      reorder: 100,
    },
    {
      name: "TMT Bars Fe500D 12mm",
      sku: "SKU-TMT-001",
      catSlug: "building-materials",
      unit: "ton",
      pp: 52000,
      sp: 58000,
      mrp: 60000,
      min: 5,
      reorder: 10,
    },
    {
      name: "Red Bricks Class A",
      sku: "SKU-BRK-001",
      catSlug: "building-materials",
      unit: "pcs",
      pp: 6,
      sp: 9,
      mrp: 10,
      min: 5000,
      reorder: 10000,
    },
    {
      name: "River Sand Fine Grade",
      sku: "SKU-SND-001",
      catSlug: "building-materials",
      unit: "ton",
      pp: 2500,
      sp: 3200,
      mrp: 3500,
      min: 10,
      reorder: 20,
    },
    {
      name: "Havells Lifeline 1.5mm Wire",
      sku: "SKU-ELC-001",
      catSlug: "electrical",
      unit: "m",
      pp: 18,
      sp: 25,
      mrp: 28,
      min: 500,
      reorder: 1000,
    },
    {
      name: "Anchor Roma Switch 6A",
      sku: "SKU-ELC-002",
      catSlug: "electrical",
      unit: "pcs",
      pp: 45,
      sp: 70,
      mrp: 80,
      min: 200,
      reorder: 500,
    },
    {
      name: "LED Bulb 9W Philips",
      sku: "SKU-ELC-003",
      catSlug: "electrical",
      unit: "pcs",
      pp: 60,
      sp: 90,
      mrp: 110,
      min: 100,
      reorder: 300,
    },
    {
      name: "Supreme PVC Pipe 1 inch",
      sku: "SKU-PLB-001",
      catSlug: "plumbing",
      unit: "ft",
      pp: 30,
      sp: 45,
      mrp: 50,
      min: 200,
      reorder: 500,
    },
    {
      name: "Jaquar Tap Pillar Cock",
      sku: "SKU-PLB-002",
      catSlug: "plumbing",
      unit: "pcs",
      pp: 450,
      sp: 650,
      mrp: 750,
      min: 20,
      reorder: 50,
    },
    {
      name: "Asian Paints Apex 20L",
      sku: "SKU-PNT-001",
      catSlug: "paints-finishes",
      unit: "pcs",
      pp: 3200,
      sp: 3800,
      mrp: 4100,
      min: 10,
      reorder: 25,
    },
    {
      name: "Berger Weathercoat 10L",
      sku: "SKU-PNT-002",
      catSlug: "paints-finishes",
      unit: "pcs",
      pp: 2800,
      sp: 3400,
      mrp: 3650,
      min: 10,
      reorder: 25,
    },
    {
      name: "Stanley Hammer 16oz",
      sku: "SKU-TLS-001",
      catSlug: "hardware-tools",
      unit: "pcs",
      pp: 350,
      sp: 500,
      mrp: 550,
      min: 30,
      reorder: 60,
    },
    {
      name: "Bosch GBH 220 Drill",
      sku: "SKU-TLS-002",
      catSlug: "hardware-tools",
      unit: "pcs",
      pp: 5500,
      sp: 6800,
      mrp: 7200,
      min: 5,
      reorder: 10,
    },
    {
      name: "GI Binding Wire 20 Gauge",
      sku: "SKU-STL-001",
      catSlug: "steel-iron",
      unit: "kg",
      pp: 70,
      sp: 95,
      mrp: 105,
      min: 100,
      reorder: 250,
    },
  ];

  const products: any[] = [];
  for (const pd of productData) {
    const cat = categories[pd.catSlug];
    const unitObj = units[pd.unit];
    const slug = pd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const prod = await prisma.product.upsert({
      where: { sku: pd.sku },
      update: {},
      create: {
        name: pd.name,
        slug,
        sku: pd.sku,
        categoryId: cat.id,
        unitId: unitObj.id,
        purchasePrice: pd.pp,
        sellingPrice: pd.sp,
        mrp: pd.mrp,
        taxPercent: 18,
        minimumStock: pd.min,
        reorderLevel: pd.reorder,
        reorderQuantity: pd.reorder * 2,
        description: `${pd.name} — premium quality for construction`,
      },
    });
    products.push(prod);
  }
  console.log(`Seeded ${products.length} products.`);

  // 8. Seed Initial Stock in Primary Warehouse
  const primaryWh = warehouses[0];
  for (const prod of products) {
    const qty = Math.floor(Math.random() * 300) + 50;
    await prisma.warehouseStock.upsert({
      where: { warehouseId_productId: { warehouseId: primaryWh.id, productId: prod.id } },
      update: {},
      create: { warehouseId: primaryWh.id, productId: prod.id, quantity: qty },
    });
    // Log initial stock movement
    await prisma.stockMovement.create({
      data: {
        productId: prod.id,
        movementType: "STOCK_IN",
        quantity: qty,
        toWarehouseId: primaryWh.id,
        referenceType: "MANUAL",
        notes: "Initial inventory seeding",
        performedBy: admin.id,
      },
    });
  }
  console.log(`Seeded stock quantities for ${products.length} products in primary warehouse.`);

  // 9. Seed Customers
  console.log("Seeding Billing Data: Customers & Invoices...");
  const customerData = [
    {
      name: "Rahul Construction Solutions",
      mobile: "9876543210",
      email: "contact@rahulconstructions.com",
      companyName: "Rahul Construction Solutions",
      customerType: "CONTRACTOR",
      creditLimit: 500000,
    },
    {
      name: "Sharma Hardware Hub",
      mobile: "9123456789",
      email: "info@sharmahardware.in",
      companyName: "Sharma Hardware Hub",
      customerType: "WHOLESALE",
      creditLimit: 200000,
    },
    {
      name: "Amit Verma",
      mobile: "9988776655",
      email: "amit.verma@example.com",
      customerType: "RETAIL",
      creditLimit: 50000,
    },
  ];
  const seededCustomers: any[] = [];
  for (const c of customerData) {
    const customer = await prisma.customer.upsert({
      where: { mobile: c.mobile },
      update: {},
      create: { ...c, totalDue: 0 },
    });
    seededCustomers.push(customer);
  }

  // 10. Seed Invoice Sequence
  await prisma.invoiceSequence.upsert({
    where: { prefix: `INV-${new Date().getFullYear()}` },
    update: {},
    create: { prefix: `INV-${new Date().getFullYear()}`, nextNumber: 1 },
  });

  console.log(`Seeded ${seededCustomers.length} customers.`);

  console.log("--------------------------------------------------");
  console.log("Seeding Multi-Tenant Commerce Foundation...");
  console.log("--------------------------------------------------");

  // 11. Seed Tenants & Subscriptions
  const t1 = await prisma.tenant.upsert({
    where: { domain: "bharat-supply.com" },
    update: {},
    create: {
      name: "Bharat Construction Supply Network",
      domain: "bharat-supply.com",
    },
  });

  const t2 = await prisma.tenant.upsert({
    where: { domain: "delhi-industrial.in" },
    update: {},
    create: {
      name: "Delhi Industrial Traders",
      domain: "delhi-industrial.in",
      status: "ACTIVE",
    },
  });
  console.log("Seeded 2 Enterprise Tenants and Subscriptions.");

  // 12. Seed Shops, Addresses, and Settings
  const shopData = [
    {
      tenantId: t1.id,
      name: "Gupta Hardware & Building Materials",
      slug: "gupta-hardware-gkp",
      type: "HARDWARE",
      city: "Gorakhpur",
      vis: true,
    },
    {
      tenantId: t1.id,
      name: "Sharma Electrical House",
      slug: "sharma-electrical-lko",
      type: "ELECTRICAL",
      city: "Lucknow",
      vis: true,
    },
    {
      tenantId: t1.id,
      name: "Royal Paints & Finishes",
      slug: "royal-paints-vns",
      type: "PAINT",
      city: "Varanasi",
      vis: false,
    },
    {
      tenantId: t2.id,
      name: "Delhi Industrial Plumbing Supply",
      slug: "delhi-plumbing",
      type: "PLUMBING",
      city: "Delhi",
      vis: true,
    },
  ];

  const seededShops: any[] = [];
  for (const s of shopData) {
    const shop = await prisma.shop.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        tenantId: s.tenantId,
        name: s.name,
        slug: s.slug,
        businessType: s.type,
        operationalStatus: "ACTIVE",
        marketplaceVisibility: s.vis,
        // address: {
        //   create: { addressLine: "Main Market Road", city: s.city, state: s.city === "Delhi" ? "DL" : "UP", pincode: "100000", country: "India" }
        // },
        // settings: {
        //   create: { currency: "INR", timezone: "Asia/Kolkata", defaultTaxPercent: 18, allowOnlineOrders: true, autoApproveListings: true }
        // }
      },
    });
    seededShops.push(shop);
  }
  console.log(`Seeded ${seededShops.length} Shops with Addresses and Settings.`);

  // 13. Seed Shop Users
  await prisma.shopUser.upsert({
    where: { shopId_userId: { shopId: seededShops[0].id, userId: admin?.id as string } },
    update: {},
    create: {
      shopId: seededShops[0].id,
      userId: admin?.id as string as string,
      role: "OWNER",
      isActive: true,
    },
  });
  console.log("Mapped Super Admin as Shop Owner to first shop.");

  // 14. Seed Marketplace Categories
  const mpCategories = [
    { name: "Heavy Structural Steel", slug: "heavy-steel" },
    { name: "Bulk Cement & Binders", slug: "bulk-cement" },
    { name: "Industrial Electricals", slug: "industrial-electricals" },
    { name: "Plumbing & Piping", slug: "plumbing-piping" },
  ];
  const createdMpCats: any[] = [];
  for (const c of mpCategories) {
    const cat = await prisma.marketplaceCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, isActive: true },
    });
    createdMpCats.push(cat);
  }
  console.log(`Seeded ${createdMpCats.length} Marketplace Categories.`);

  // 15. Seed Marketplace Listings
  // Assuming products[0] (Cement) and products[2] (TMT) exist from earlier seed
  if (products.length >= 3) {
    await prisma.marketplaceListing.createMany({
      skipDuplicates: true,
      data: [
        {
          shopId: seededShops[0].id, // Gupta Hardware
          productId: products[2].id, // TMT Bars
          marketplaceCategoryId: createdMpCats[0].id, // Steel
          title: "Premium Fe500D TMT Rebars (Bulk Pricing)",
          price: 57000,
          isActive: true,
          isFeatured: true,
          regionalAvailability: "Uttar Pradesh, Bihar",
        },
        {
          shopId: seededShops[0].id,
          productId: products[0].id, // Cement
          marketplaceCategoryId: createdMpCats[1].id, // Cement
          title: "UltraTech OPC 43 Grade Cement (50kg Bag)",
          price: 410,
          isActive: true,
          isFeatured: false,
          regionalAvailability: "Gorakhpur Region",
        },
      ],
    });
    console.log("Seeded 2 Marketplace Listings.");
  }

  console.log("==================================================");
  console.log("Maal-Material Database Seeding COMPLETE!");
  console.log(`Default Super Admin: ${adminEmail}`);
  console.log("Password: Admin123!");
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("Critical error during seeder execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
