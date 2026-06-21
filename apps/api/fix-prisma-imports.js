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
  const newContent = content.replace(/from '\.\.\/\.\.\/prisma\/prisma\.service'/g, "from '../../database/prisma.service'");
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`Fixed prisma import in ${file}`);
  }
}
