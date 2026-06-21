import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Industrial B2B Marketplace Ecosystem...");
  const tenantId = "tenant-1";

  // 1. Create Vendors
  const v1 = await prisma.marketplaceVendor.create({
    data: {
      tenantId,
      vendorName: "Global Steel Dynamics",
      vendorCode: "VND-GSD-001",
      industryType: "MANUFACTURER",
      verificationLevel: "ENTERPRISE",
      establishedYear: 1985,
      taxId: "TX-GSD-888",
      globalRegion: "North America",
      contactEmail: "sales@globalsteel.com",
      contactPhone: "+1-555-0192",
      rating: 4.8,
    },
  });

  const v2 = await prisma.marketplaceVendor.create({
    data: {
      tenantId,
      vendorName: "HeavyLift Logistics",
      vendorCode: "VND-HLL-002",
      industryType: "LOGISTICS",
      verificationLevel: "PLATINUM",
      establishedYear: 2002,
      globalRegion: "Europe",
      contactEmail: "freight@heavylift.eu",
      contactPhone: "+44-20-7946-0958",
      rating: 4.9,
    },
  });

  // 2. Create Storefronts
  await prisma.vendorStorefront.create({
    data: {
      vendorId: v1.id,
      storeName: "GSD Structural Steel Direct",
      storeDescription: "High-grade TMT bars, structural beams, and heavy industrial plates.",
      minOrderValue: 50000,
    },
  });

  // 3. Create RFQ Exchange
  const rfq = await prisma.rFQExchange.create({
    data: {
      tenantId,
      rfqCode: "RFQ-STL-2026",
      title: "Bulk TMT Steel Rebars - 50,000 MT",
      description: "Requirement for high-tensile TMT steel rebars for the Mega-Refinery Expansion.",
      targetCategory: "RAW_MATERIALS",
      budgetMax: 2500000,
      deadline: new Date("2026-06-30T00:00:00Z"),
      status: "OPEN",
      deliveryLocation: "Delta Region Port",
    },
  });

  // 4. Create Quotation
  await prisma.marketplaceQuotation.create({
    data: {
      rfqId: rfq.id,
      vendorId: v1.id,
      quoteAmount: 2350000,
      validUntil: new Date("2026-06-15T00:00:00Z"),
      deliveryLeadTimeDays: 45,
      status: "SUBMITTED",
    },
  });

  // 5. Create Commerce Order
  const order = await prisma.commerceOrder.create({
    data: {
      tenantId,
      orderNumber: "ORD-MKT-00100",
      vendorId: v2.id,
      totalAmount: 125000,
      paymentTerms: "NET_30",
      fulfillmentStatus: "PROCESSING",
      paymentStatus: "UNPAID",
      expectedDelivery: new Date("2026-06-10T00:00:00Z"),
      notes: "Transport of heavy cooling towers to Site C",
    },
  });

  // 6. Create Settlement
  await prisma.marketplaceSettlement.create({
    data: {
      orderId: order.id,
      vendorId: v2.id,
      settlementAmount: 125000,
      platformFeeAmount: 2500,
      netVendorAmount: 122500,
      settlementStatus: "PENDING",
    },
  });

  // 7. Create Ecosystem Connection
  await prisma.ecosystemConnection.create({
    data: {
      tenantId,
      vendorId: v1.id,
      connectionType: "STRATEGIC_PARTNER",
    },
  });

  console.log("Seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
