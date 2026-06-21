import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Validating Prisma DB Writes (E2E Validation)...');
  
  const tenantId = 'tenant_test_' + Date.now();
  
  try {
    // Attempt to create a Ledger related record (ChartOfAccount + GeneralLedgerAccount)
    console.log('1. Creating ChartOfAccount...');
    const chart = await prisma.chartOfAccount.create({
      data: {
        tenantId,
        code: `COA-${Date.now()}`,
        name: 'Test Assets Account',
        type: 'ASSET',
        category: 'CURRENT_ASSET',
        description: 'E2E Validation Account',
        isActive: true,
        isControl: false,
      }
    });
    console.log('✅ ChartOfAccount created successfully:', chart.id);

    console.log('2. Creating GeneralLedgerAccount...');
    const ledger = await prisma.generalLedgerAccount.create({
      data: {
        tenantId,
        chartOfAccountId: chart.id,
        accountNumber: `GL-${Date.now()}`,
        name: 'Main Cash Account',
        balance: 1000.0,
        currency: 'USD',
      }
    });
    console.log('✅ GeneralLedgerAccount created successfully:', ledger.id);

    // Clean up
    console.log('3. Cleaning up test data...');
    await prisma.generalLedgerAccount.delete({ where: { id: ledger.id } });
    await prisma.chartOfAccount.delete({ where: { id: chart.id } });
    console.log('✅ Cleanup successful.');
    
    console.log('🎉 VALIDATION PASSED: Prisma Client can successfully write to the database schema without throwing validation errors.');
    
  } catch (error) {
    console.error('❌ VALIDATION FAILED: Prisma schema write threw an error.', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
