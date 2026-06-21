const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.controller.ts')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles(path.join(__dirname, 'src', 'modules'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('@Post(') || content.includes('@Body(')) {
    // Check if Post and Body are missing from the import
    const importRegex = /import\s+{(.*?)}\s+from\s+'@nestjs\/common'/;
    const match = content.match(importRegex);
    if (match) {
      let importedItems = match[1].split(',').map(i => i.trim());
      let modified = false;
      if (content.includes('@Post(') && !importedItems.includes('Post')) {
        importedItems.push('Post');
        modified = true;
      }
      if (content.includes('@Body(') && !importedItems.includes('Body')) {
        importedItems.push('Body');
        modified = true;
      }
      if (content.includes('@Param(') && !importedItems.includes('Param')) {
        importedItems.push('Param');
        modified = true;
      }
      
      if (modified) {
        const newImport = `import { ${importedItems.join(', ')} } from '@nestjs/common'`;
        content = content.replace(match[0], newImport);
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Added missing decorators to ${file}`);
      }
    }
  }
}
