const fs = require('fs');
const path = require('path');

const logOutput = fs.readFileSync('c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api/tsc_errors.log', 'utf8');

// Extract unique files with errors
const errorLines = logOutput.split('\n').filter(line => line.includes('error TS'));
const files = [...new Set(errorLines.map(line => line.split('(')[0].trim()))];

console.log(`Found ${files.length} files to process.`);

files.forEach(file => {
  if (!file) return;
  
  const fullPath = path.join('c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  // General pluralization fixes
  content = content.replace(/\bsupplier:/g, 'suppliers:');
  content = content.replace(/\bcustomer:/g, 'customers:');
  content = content.replace(/\bdriver:/g, 'drivers:');
  content = content.replace(/\bwarehouse:/g, 'warehouses:');
  content = content.replace(/\bdelivery:/g, 'deliveries:');
  
  // Specific contextual fixes for 'items' and others
  if (file.includes('purchases.service.ts')) {
    content = content.replace(/items:\s*\{/g, 'purchaseItems: {');
    content = content.replace(/items:\s*true/g, 'purchaseItems: true');
  }
  else if (file.includes('dispatch.service.ts')) {
    content = content.replace(/items:/g, 'dispatchItems:');
  }
  else if (file.includes('delivery.service.ts')) {
    content = content.replace(/items:/g, 'deliveryItems:');
  }
  else if (file.includes('invoices.service.ts')) {
    content = content.replace(/items:/g, 'invoiceItems:');
  }
  else if (file.includes('marketplace.service.ts')) {
    content = content.replace(/category:/g, 'marketplaceCategories:');
    content = content.replace(/shop:/g, 'shops:');
    content = content.replace(/settings:/g, 'shops:'); // shops settings
  }
  else if (file.includes('deployments.service.ts')) {
    content = content.replace(/events:/g, 'deploymentEvents:');
  }
  else if (file.includes('ledger.service.ts')) {
    content = content.replace(/entries:/g, 'ledgerEntries:');
  }
  else if (file.includes('cart.service.ts')) {
    content = content.replace(/items:/g, 'cartItems:');
  }
  else if (file.includes('order-fulfillment.service.ts')) {
    content = content.replace(/items:/g, 'fulfillmentItems:');
  }
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
