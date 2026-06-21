const fs = require('fs');
const path = require('path');

const storesDir = path.join(__dirname, 'src', 'stores');
const targetStores = ['authStore.ts', 'customerStore.ts', 'invoiceStore.ts', 'fraudStore.ts', 'materialStore.ts'];

for (const storeFile of targetStores) {
  const fullPath = path.join(storesDir, storeFile);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace explicit any with unknown
  content = content.replace(/: Promise<any>/g, ': Promise<unknown>');
  content = content.replace(/: any\)/g, ': unknown)');
  content = content.replace(/<any>/g, '<unknown>');
  content = content.replace(/err: any/g, 'err: unknown');
  content = content.replace(/error: any/g, 'error: unknown');
  content = content.replace(/data: any/g, 'data: unknown');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Fixed types in:', storeFile);
}
