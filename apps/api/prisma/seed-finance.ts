import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenantId = "tenant-1";

  console.log("Seeding Enterprise Financial Core...");

  // 1. Chart of Accounts
  const coas = [
    { code: "1000", name: "Cash and Cash Equivalents", type: "ASSET", category: "Current Asset" },
    { code: "1200", name: "Accounts Receivable", type: "ASSET", category: "Current Asset" },
    { code: "2000", name: "Accounts Payable", type: "LIABILITY", category: "Current Liability" },
    { code: "3000", name: "Owner Equity", type: "EQUITY", category: "Equity" },
    { code: "4000", name: "Product Revenue", type: "REVENUE", category: "Operating Revenue" },
    { code: "5000", name: "Cost of Goods Sold", type: "EXPENSE", category: "Operating Expense" },
    { code: "5100", name: "Payroll Expense", type: "EXPENSE", category: "Operating Expense" },
  ];

  const createdCoas = [];
  for (const coa of coas) {
    const created = await prisma.chartOfAccount.upsert({
      where: { tenantId_code: { tenantId, code: coa.code } },
      update: {},
      create: { ...coa, tenantId },
    });
    createdCoas.push(created);
  }

  // 2. Ledger Accounts
  const ledgers = [
    {
      chartOfAccountCode: "1000",
      accountNumber: "1000-01",
      name: "Main Operating Bank",
      balance: 500000,
    },
    { chartOfAccountCode: "1200", accountNumber: "1200-01", name: "AR - Trade", balance: 150000 },
    { chartOfAccountCode: "2000", accountNumber: "2000-01", name: "AP - Trade", balance: -80000 },
    {
      chartOfAccountCode: "4000",
      accountNumber: "4000-01",
      name: "Software Sales",
      balance: -700000,
    },
    {
      chartOfAccountCode: "5100",
      accountNumber: "5100-01",
      name: "Engineering Salaries",
      balance: 130000,
    },
  ];

  const createdLedgers = [];
  for (const ledger of ledgers) {
    const coa = createdCoas.find((c) => c.code === ledger.chartOfAccountCode);
    const created = await prisma.generalLedgerAccount.upsert({
      where: { tenantId_accountNumber: { tenantId, accountNumber: ledger.accountNumber } },
      update: {},
      create: {
        tenantId,
        chartOfAccountId: coa!.id,
        accountNumber: ledger.accountNumber,
        name: ledger.name,
        balance: ledger.balance,
      },
    });
    createdLedgers.push(created);
  }

  // 3. Tax Rules
  const taxes = [
    { country: "IN", taxType: "GST", taxRate: 18, description: "Standard GST 18%" },
    { country: "US", taxType: "VAT", taxRate: 8.5, description: "State VAT 8.5%" },
  ];

  for (const tax of taxes) {
    await prisma.taxRule.upsert({
      where: {
        tenantId_taxType_country_region: {
          tenantId,
          taxType: tax.taxType,
          country: tax.country,
          region: "",
        },
      },
      update: {},
      create: { ...tax, tenantId, region: "" },
    });
  }

  // 4. Treasury (Bank Accounts)
  const banks = [
    {
      bankName: "Chase Corporate",
      accountNumber: "CH-893294",
      accountType: "CHECKING",
      currentBalance: 450000,
    },
    {
      bankName: "HSBC Global",
      accountNumber: "HS-112344",
      accountType: "SAVINGS",
      currentBalance: 1200000,
    },
  ];

  for (const bank of banks) {
    await prisma.bankAccount.upsert({
      where: { tenantId_accountNumber: { tenantId, accountNumber: bank.accountNumber } },
      update: {},
      create: { ...bank, tenantId },
    });
  }

  console.log("✅ Enterprise Financial Core seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
