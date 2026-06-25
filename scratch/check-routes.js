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
      
      // A route is broken if it is under 500 bytes and doesn't import custom components
      if (content.length < 500 && !content.includes('import {') && !content.includes('import ')) {
        results.broken.push(route);
      } 
      // A route is partial if it says coming soon or is very short with no component imports
      else if (content.includes('Coming Soon') || content.includes('<div>page</div>') || (content.length < 1000 && !content.includes('@/components'))) {
        results.partial.push(route);
      } 
      else {
        results.working.push(route);
      }
    }
  }
}

walk(dir);
fs.writeFileSync('route_audit.json', JSON.stringify(results, null, 2));
console.log('Audit complete.');
