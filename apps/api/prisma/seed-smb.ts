import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SMB Onboarding Data...");

  // Get first tenant
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.log("No tenant found. Please run seed-finance.ts first.");
    return;
  }

  // Create an SMB Shop
  const shopId = crypto.randomUUID();
  const shop = await prisma.shop.create({
    data: {
      id: shopId,
      tenantId: tenant.id,
      name: "Shree Ram Hardware & Paints",
      slug: "shree-ram-hardware-" + Date.now(),
      businessType: "HARDWARE",
      gstin: "27AADCB2230M1Z2",
      ownerName: "Ramesh Kumar",
      operationalStatus: "ACTIVE",
    },
  });

  // Seed SMB Profile
  await prisma.shopProfile.create({
    data: {
      shopId: shop.id,
      hindiName: "श्री राम हार्डवेयर",
      primaryLanguage: "hi",
      defaultBillingUnit: "PCS",
      smartTaxEnabled: true,
    },
  });

  // Seed Onboarding State
  await prisma.sMBOnboarding.create({
    data: {
      shopId: shop.id,
      isProfileComplete: true,
      isGstConfigured: true,
      currentStep: 3,
      businessCategory: "HARDWARE",
    },
  });

  // Seed Quick Actions
  await prisma.quickAction.createMany({
    data: [
      {
        tenantId: tenant.id,
        shopId: shop.id,
        actionType: "QUICK_BILL",
        label: "Naya Bill Banao",
        orderIndex: 1,
      },
      {
        tenantId: tenant.id,
        shopId: shop.id,
        actionType: "ADD_UDHARI",
        label: "Udhari Likho",
        orderIndex: 2,
      },
      {
        tenantId: tenant.id,
        shopId: shop.id,
        actionType: "STOCK_ENTRY",
        label: "Maal Aaya",
        orderIndex: 3,
      },
    ],
  });

  // Seed Localized Labels
  const labels = [
    { key: "btn.quickbill", en: "Quick Bill", hi: "Naya Bill Banaye" },
    { key: "lbl.inventory", en: "Check Stock", hi: "Stock Dekhe" },
    { key: "lbl.ledger", en: "Ledger Book", hi: "Khaata (Udhari)" },
  ];
  for (const lbl of labels) {
    await prisma.localizedLabel.upsert({
      where: { key: lbl.key },
      update: {},
      create: lbl,
    });
  }

  console.log("SMB Seeding Complete: Shree Ram Hardware & Paints created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
