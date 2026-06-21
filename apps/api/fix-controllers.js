const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');
const modules = [
  { name: 'construction-projects', path: 'construction/projects' },
  { name: 'construction-boq', path: 'construction/boq' },
  { name: 'construction-site-operations', path: 'construction/site-operations' },
  { name: 'construction-labor', path: 'construction/labor' },
  { name: 'construction-equipment', path: 'construction/equipment' }
];

modules.forEach(mod => {
  const file = path.join(srcDir, mod.name, mod.name + '.controller.ts');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("@Controller('api/v1/" + mod.path + "')", "@Controller('" + mod.path + "')");
  fs.writeFileSync(file, content);
});

console.log('Fixed controllers');
