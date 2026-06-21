const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src', 'modules'), function(filePath) {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Clean up empty commas
    content = content.replace(/\{\s*,/g, '{ ');
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/,\s*\}/g, ' }');
    content = content.replace(/include:\s*\{\s*\}/g, ''); // empty includes

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Syntax cleaned: ${filePath}`);
    }
  }
});
