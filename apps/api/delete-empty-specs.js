const fs = require('fs');
const path = require('path');

function findSpecFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findSpecFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.spec.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const specFiles = findSpecFiles(path.join(__dirname, 'src'));

for (const fullPath of specFiles) {
  // don't delete important ones
  if (fullPath.includes('idempotency') || fullPath.includes('security') || fullPath.includes('tenants.service.spec')) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // if the file is basically just a toBeDefined test, delete it.
  const isDefault = content.includes('toBeDefined();') && (content.split('it(').length <= 2);
  
  if (isDefault) {
      fs.unlinkSync(fullPath);
      console.log('Deleted:', fullPath);
  }
}
