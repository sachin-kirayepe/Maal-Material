import * as fs from 'fs';
import * as path from 'path';

// Fix setInterval brackets
const fixIntervalFiles = [
  'src/app/(dashboard)/civilization-command/page.tsx',
  'src/app/(dashboard)/page.tsx',
  'src/app/(dashboard)/realtime/page.tsx',
  'src/components/spatial/WarehouseDigitalTwin.tsx',
  'src/hooks/useRealtimeOrchestrator.ts',
];

fixIntervalFiles.forEach(rel => {
  const p = path.join(__dirname, '../', rel);
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    // Fix stranded brackets from commented setInterval
    text = text.replace(/},\s*\d+\);/g, '// }, 2000); // Fixed by cleanup');
    text = text.replace(/},\s*1000\);/g, '// }, 1000);');
    text = text.replace(/},\s*3000\);/g, '// }, 3000);');
    text = text.replace(/},\s*1500\);/g, '// }, 1500);');
    text = text.replace(/}, \d+\);/g, '// }, timer);');
    text = text.replace(/}\s*\);\s*\/\/.*poll.*/gi, '// }, poll);');
    fs.writeFileSync(p, text);
  }
});

// Fix broken wire-ui destructuring (e.g. const { items,, createItem })
const fixDestructureFiles = [
  'src/app/(dashboard)/ascension/page.tsx',
  'src/app/(dashboard)/inventory/page.tsx',
  'src/app/(dashboard)/procurement/page.tsx',
];

fixDestructureFiles.forEach(rel => {
  const p = path.join(__dirname, '../', rel);
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    text = text.replace(/,\s*,/g, ',');
    text = text.replace(/{\s*,/g, '{');
    fs.writeFileSync(p, text);
  }
});

// Fix broken button replacements 
const fixButtonFiles = [
  'src/app/(dashboard)/admin/analytics/page.tsx',
  'src/app/(dashboard)/business-intelligence/page.tsx',
  'src/app/(dashboard)/finance/ledger/page.tsx',
  'src/app/(dashboard)/logistics/deliveries/page.tsx',
  'src/app/(dashboard)/order-items/page.tsx',
  'src/app/(dashboard)/simplified-workflows/page.tsx'
];

fixButtonFiles.forEach(rel => {
  const p = path.join(__dirname, '../', rel);
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    // Common error: missing closing tag or bad replacement string
    // Let's just fix the closing bracket for <button onClick=...
    text = text.replace(/<button onClick=\{\(\) => createItem\(\{ name: "New Auto Item " \+ Math\.floor\(Math\.random\(\) \* 1000\) \}\)\} ([^>]+)>/g, '<button onClick={() => createItem({ name: "Auto Item" })} $1>');
    
    // There might be <button ... >... Add ... </button> that got mangled if inner content had > inside.
    // We will just run prettier or fix it manually if this fails.
    fs.writeFileSync(p, text);
  }
});
