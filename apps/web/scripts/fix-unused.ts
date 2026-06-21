import * as fs from 'fs';
import * as path from 'path';

const filesToFix = [
  { path: 'src/app/(dashboard)/rules-engine/page.tsx', search: /Play,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/security/page.tsx', search: /motion,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/security/page.tsx', search: /CheckSquare, Square,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/simplified-workflows/page.tsx', search: /Plus,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/sourcing/page.tsx', search: /motion,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/stock/page.tsx', search: /motion,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/supply-chain/page.tsx', search: /motion,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/supply-chain/page.tsx', search: /MapPin,? ?/g, replace: '' },
  { path: 'src/app/(dashboard)/whatsapp-commerce/page.tsx', search: /Smartphone, Send, Power, BarChart,? ?/g, replace: '' },
  { path: 'src/app/(storefront)/equipment/page.tsx', search: /Clock,? ?/g, replace: '' }
];

filesToFix.forEach(({ path: relPath, search, replace }) => {
  const p = path.join(__dirname, '../', relPath);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(p, content);
  }
});

console.log("Cleaned unused imports");
