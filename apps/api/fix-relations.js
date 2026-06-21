const fs = require('fs');
const path = require('path');
const glob = require('glob');

const replacements = [
  // Dispatch
  { path: 'src/modules/dispatch', regex: /\bitems\b/g, replace: 'dispatchItems' },
  // Cart
  { path: 'src/modules/cart', regex: /\bitems\b/g, replace: 'cartItems' },
  // Order
  { path: 'src/modules/orders', regex: /\bitems\b/g, replace: 'orderItems' },
  { path: 'src/modules/orders', regex: /\baddresses\b/g, replace: 'orderAddresses' },
  // Supplier
  { path: 'src/modules/suppliers', regex: /\baddresses\b/g, replace: 'supplierAddresses' },
  // Roles
  { path: 'src/modules/roles', regex: /\bpermissions\b/g, replace: 'rolePermissions' },
  // StockMovement
  { path: 'src/modules/stock', regex: /\bfromWarehouse\b/g, replace: 'fromWarehouseId' }, // Or whatever it is
];

function doReplace(dir, regex, replacement) {
  const files = fs.readdirSync(path.join(__dirname, dir));
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const fullPath = path.join(__dirname, dir, file);
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(regex, replacement);
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

for (const rule of replacements) {
  if (fs.existsSync(path.join(__dirname, rule.path))) {
    doReplace(rule.path, rule.regex, rule.replace);
  }
}

console.log("Bulk replacements done");
