const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');
const modules = ['construction-projects', 'construction-boq', 'construction-site-operations', 'construction-labor', 'construction-equipment'];

modules.forEach(mod => {
  const file = path.join(srcDir, mod, mod + '.service.ts');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('../../prisma/prisma.service', '../../database/prisma.service');
  fs.writeFileSync(file, content);
});

console.log('Fixed imports');
