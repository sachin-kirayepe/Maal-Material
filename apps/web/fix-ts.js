const fs = require('fs');
const path = require('path');

const storesDir = path.join(__dirname, 'src', 'stores');
const files = ['authStore.ts', 'customerStore.ts', 'fraudStore.ts', 'invoiceStore.ts', 'materialStore.ts'];

files.forEach(file => {
  const filePath = path.join(storesDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix err: unknown in catch blocks
  content = content.replace(/catch \((err|error): unknown\)/g, 'catch ($1: any)');
  content = content.replace(/catch \((err|error)\)/g, 'catch ($1: any)');
  
  // Fix generic ApiClient calls defaulting to {}
  content = content.replace(/ApiClient\.(get|post|put|patch|delete)\(/g, 'ApiClient.$1<any>(');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
