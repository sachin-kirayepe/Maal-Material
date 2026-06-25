const fs = require('fs');

const unprotectedFiles = [
"apps/api/src/modules/accounting/accounting.controller.ts",
"apps/api/src/modules/b2b-marketplace/b2b-marketplace.controller.ts",
"apps/api/src/modules/commerce-intelligence/commerce-intelligence.controller.ts",
"apps/api/src/modules/commerce-network/commerce-network.controller.ts",
"apps/api/src/modules/construction-boq/construction-boq.controller.ts",
"apps/api/src/modules/construction-equipment/construction-equipment.controller.ts",
"apps/api/src/modules/construction-labor/construction-labor.controller.ts",
"apps/api/src/modules/construction-projects/construction-projects.controller.ts",
"apps/api/src/modules/construction-site-operations/construction-site-operations.controller.ts",
"apps/api/src/modules/credit/credit.controller.ts",
"apps/api/src/modules/deployments/deployments.controller.ts",
"apps/api/src/modules/devops/devops.controller.ts",
"apps/api/src/modules/digital-exchange/digital-exchange.controller.ts",
"apps/api/src/modules/disputes/disputes.controller.ts",
"apps/api/src/modules/ecosystem/ecosystem.controller.ts",
"apps/api/src/modules/equipment/equipment.controller.ts",
"apps/api/src/modules/equipment-availability/equipment-availability.controller.ts",
"apps/api/src/modules/finance/finance.controller.ts",
"apps/api/src/modules/fleet/fleet.controller.ts",
"apps/api/src/modules/fraud-detection/fraud-detection.controller.ts",
"apps/api/src/modules/health/health.controller.ts",
"apps/api/src/modules/intelligence/intelligence.controller.ts",
"apps/api/src/modules/inventory-sharing/inventory-sharing.controller.ts",
"apps/api/src/modules/iot-telemetry/webhook.controller.ts",
"apps/api/src/modules/monitoring/monitoring.controller.ts",
"apps/api/src/modules/network-resilience/network-resilience.controller.ts",
"apps/api/src/modules/offline-sync/offline-sync.controller.ts",
"apps/api/src/modules/operational-analytics/operational-analytics.controller.ts",
"apps/api/src/modules/order-items/order-items.controller.ts",
"apps/api/src/modules/payments/webhook.controller.ts",
"apps/api/src/modules/predictions/predictions.controller.ts",
"apps/api/src/modules/purchase-intelligence/purchase-intelligence.controller.ts",
"apps/api/src/modules/recommendations/recommendations.controller.ts",
"apps/api/src/modules/reconciliation/reconciliation.controller.ts",
"apps/api/src/modules/releases/releases.controller.ts",
"apps/api/src/modules/reminders/reminders.controller.ts",
"apps/api/src/modules/rental-rfq/rental-rfq.controller.ts",
"apps/api/src/modules/rentals/rentals.controller.ts",
"apps/api/src/modules/reputation/reputation.controller.ts",
"apps/api/src/modules/rfq-exchange/rfq-exchange.controller.ts",
"apps/api/src/modules/risk-analysis/risk-analysis.controller.ts",
"apps/api/src/modules/risk-assessment/risk-assessment.controller.ts",
"apps/api/src/modules/simplified-workflows/simplified-workflows.controller.ts",
"apps/api/src/modules/smb-onboarding/smb-onboarding.controller.ts",
"apps/api/src/modules/sourcing/sourcing.controller.ts",
"apps/api/src/modules/subscriptions/subscriptions.controller.ts",
"apps/api/src/modules/supply-chain/supply-chain.controller.ts",
"apps/api/src/modules/tax/tax.controller.ts",
"apps/api/src/modules/treasury/treasury.controller.ts",
"apps/api/src/modules/trust/trust.controller.ts",
"apps/api/src/modules/universal-api/universal-api.controller.ts",
"apps/api/src/modules/vendor-discovery/vendor-discovery.controller.ts",
"apps/api/src/modules/vendor-network/vendor-network.controller.ts",
"apps/api/src/modules/vendors/vendors.controller.ts",
"apps/api/src/modules/whatsapp-commerce/whatsapp-commerce.controller.ts"
];

for (const file of unprotectedFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already guarded (just in case)
    if (content.includes('@UseGuards(')) continue;

    // 1. Add UseGuards import to @nestjs/common if not exists
    if (!content.includes('UseGuards')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@nestjs\/common['"]/, (match, group) => {
        return `import { ${group.trim()}, UseGuards } from '@nestjs/common'`;
      });
    }

    // 2. Add ApiBearerAuth import to @nestjs/swagger if not exists
    if (content.includes('@nestjs/swagger')) {
      if (!content.includes('ApiBearerAuth')) {
        content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@nestjs\/swagger['"]/, (match, group) => {
          return `import { ${group.trim()}, ApiBearerAuth } from '@nestjs/swagger'`;
        });
      }
    } else {
      content = `import { ApiBearerAuth } from '@nestjs/swagger';\n` + content;
    }

    // 3. Add custom guard imports
    const guardImports = `
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
`;
    // Insert after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\\n', lastImportIndex);
    
    // Simpler way: just prepend to the file after the first few imports, or at the top.
    content = guardImports.trim() + '\n' + content;

    // 4. Inject @UseGuards and @ApiBearerAuth before @Controller
    content = content.replace(/@Controller\(/, `@ApiBearerAuth()\n@UseGuards(AuthGuard, RolesGuard, TenantGuard)\n@Controller(`);

    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', file);
  } catch (err) {
    console.error('Error patching', file, err.message);
  }
}
