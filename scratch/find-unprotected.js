const fs = require('fs');
const path = require('path');

function findControllers(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findControllers(filePath, fileList);
    } else if (filePath.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const controllers = findControllers('apps/api/src');
const unprotected = [];

for (const c of controllers) {
  const content = fs.readFileSync(c, 'utf8');
  if (!content.includes('@UseGuards(')) {
    unprotected.push(c);
  }
}

console.log(`Found ${unprotected.length} unprotected controllers:`);
unprotected.forEach(u => console.log(u));
