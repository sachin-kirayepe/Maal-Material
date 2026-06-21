const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.ts')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles(path.join(__dirname, 'src', 'modules'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  content = content.replace(/\/\* address: true \*\//g, '');
  content = content.replace(/\/\* users: true \*\//g, '');
  content = content.replace(/\/\* attendances: true \*\//g, '');
  
  // Fix suppliers.service.ts
  content = content.replace(/\/\* addresses: \*\//g, '//');
  
  // Clean up double commas or leading/trailing commas in objects
  content = content.replace(/\{\s*,/g, '{');
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*\}/g, '}');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Fixed ${file}`);
  }
}
