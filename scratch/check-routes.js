const fs = require('fs');
const path = require('path');

const dir = path.resolve('apps/web/src/app/(dashboard)');
const results = { working: [], partial: [], broken: [] };

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name === 'page.tsx') {
      const route = fullPath.replace(dir, '').replace(/\\/g, '/').replace('/page.tsx', '') || '/';
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.length < 500 || content.includes('Coming Soon') || content.includes('<div>page</div>')) {
        results.broken.push(route);
      } else if (content.length < 3000) {
        results.partial.push(route);
      } else {
        results.working.push(route);
      }
    }
  }
}

walk(dir);
fs.writeFileSync('route_audit.json', JSON.stringify(results, null, 2));
console.log('Audit complete.');
