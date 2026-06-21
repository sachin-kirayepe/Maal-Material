const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');

function replaceInFile(filePath, searchRegex, replaceWith) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchRegex, replaceWith);
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// 1. users.service.ts -> permissions is not in RoleInclude
const usersServicePath = path.join(srcDir, 'users', 'users.service.ts');
replaceInFile(usersServicePath, /include: \{ permissions: true \}/g, 'include: {}');

// 2. tenants.service.ts -> subscriptions is not in TenantInclude, ShopCountOutputTypeSelect
const tenantsServicePath = path.join(srcDir, 'tenants', 'tenants.service.ts');
replaceInFile(tenantsServicePath, /subscriptions: true/g, '');
replaceInFile(tenantsServicePath, /users: true/g, '');

// 3. workers.service.ts -> attendances is not in WorkerInclude
const workersServicePath = path.join(srcDir, 'workers', 'workers.service.ts');
replaceInFile(workersServicePath, /attendances: true/g, '');

// 4. warehouses.service.ts -> stocks is not in WarehouseCountOutputTypeSelect
const warehousesServicePath = path.join(srcDir, 'warehouses', 'warehouses.service.ts');
replaceInFile(warehousesServicePath, /stocks: true/g, '');

// 5. suppliers.service.ts -> addresses is not in SupplierInclude
const suppliersServicePath = path.join(srcDir, 'suppliers', 'suppliers.service.ts');
replaceInFile(suppliersServicePath, /addresses: \{[\s\S]*?\}/g, '');
replaceInFile(suppliersServicePath, /addresses: true/g, '');

// 6. stock.service.ts -> fromWarehouse, toWarehouse is not in StockMovementInclude
const stockServicePath = path.join(srcDir, 'stock', 'stock.service.ts');
replaceInFile(stockServicePath, /fromWarehouse: true/g, '');
replaceInFile(stockServicePath, /toWarehouse: true/g, '');
replaceInFile(stockServicePath, /warehouse: true/g, 'warehouses: true');
replaceInFile(stockServicePath, /category: true/g, '');

// 7. Unused imports in controllers
const vnControllerPath = path.join(srcDir, 'vendor-network', 'vendor-network.controller.ts');
replaceInFile(vnControllerPath, /Param, /, '');

const vendorsControllerPath = path.join(srcDir, 'vendors', 'vendors.controller.ts');
replaceInFile(vendorsControllerPath, /Post, Body, /, '');

console.log('TS fixes complete.');
