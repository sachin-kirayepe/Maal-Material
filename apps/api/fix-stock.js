const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'modules', 'stock', 'stock.service.ts');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/,\s*,/g, ',');
fs.writeFileSync(file, content);
console.log('Fixed stock.service.ts');
