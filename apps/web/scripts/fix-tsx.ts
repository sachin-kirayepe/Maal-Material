import * as fs from 'fs';
import * as path from 'path';

function replace(file: string, search: RegExp | string, replaceVal: string) {
  const p = path.join(__dirname, '../', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replaceVal);
    fs.writeFileSync(p, content);
  }
}

// 1. analytics/page.tsx
replace('src/app/(dashboard)/admin/analytics/page.tsx', 
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\s*{isLoading && !overview \? \(/g, 
  '{isLoading && !overview ? (');

replace('src/app/(dashboard)/admin/analytics/page.tsx', 
  /      <\/>}\n    <\/div>/g, 
  '      </>)}\n    </div>');

// 2. business-intelligence/page.tsx
replace('src/app/(dashboard)/business-intelligence/page.tsx', 
  /      <\/>}\n    <\/div>/g, 
  '      </>)}\n    </div>');
replace('src/app/(dashboard)/business-intelligence/page.tsx', 
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\s*{isLoading && !overview \? \(/g, 
  '{isLoading && !overview ? (');

// 3. finance/ledger/page.tsx
replace('src/app/(dashboard)/finance/ledger/page.tsx', 
  /      <\/>}\n    <\/div>/g, 
  '      </>)}\n    </div>');
replace('src/app/(dashboard)/finance/ledger/page.tsx',
  /<div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">\s*{isLoading && items\.length === 0 \? \(/g,
  '{isLoading && items.length === 0 ? (');

// 4. logistics/deliveries/page.tsx
replace('src/app/(dashboard)/logistics/deliveries/page.tsx', 
  /      <\/>}\n    <\/div>/g, 
  '      </>)}\n    </div>');
replace('src/app/(dashboard)/logistics/deliveries/page.tsx',
  /<div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">\s*{isLoading && activeDeliveries\.length === 0 \? \(/g,
  '{isLoading && activeDeliveries.length === 0 ? (');

// 5. order-items/page.tsx
replace('src/app/(dashboard)/order-items/page.tsx',
  /<button onClick=\{\(\) => createItem\(\{ name: "Auto Item" \}\)\} ([^>]+)>/g,
  '<button onClick={() => createItem({ name: "Auto Item" })} $1>');
replace('src/app/(dashboard)/order-items/page.tsx',
  /<button onClick=\{\(\) => createItem\(\{ name: "New Auto Item "[^}]+\}\)\} ([^>]+)>/g,
  '<button onClick={() => createItem({ name: "Auto Item" })} $1>');

// 6. simplified-workflows/page.tsx
replace('src/app/(dashboard)/simplified-workflows/page.tsx',
  /<button onClick=\{\(\) => createItem\(\{ name: "Auto Item" \}\)\} ([^>]+)>/g,
  '<button onClick={() => createItem({ name: "Auto Item" })} $1>');
replace('src/app/(dashboard)/simplified-workflows/page.tsx',
  /<button onClick=\{\(\) => createItem\(\{ name: "New Auto Item "[^}]+\}\)\} ([^>]+)>/g,
  '<button onClick={() => createItem({ name: "Auto Item" })} $1>');

// 7. useRealtimeOrchestrator.ts
replace('src/hooks/useRealtimeOrchestrator.ts',
  /          Math.floor\(Math.random\(\) \* 4\)\n        \] as any,\n        value: parseFloat\(\(Math.random\(\) \* 5\).toFixed\(3\)\),\n        timestamp: new Date\(\).toISOString\(\),\n      };\n      addTransaction\(mockTx\);\n    \/\/ }, 1500\);\n\n    \/\/ return \(\) => clearInterval\(txInterval\);\n  }, \[addTransaction\]\);/g,
  `          Math.floor(Math.random() * 4)\n        ] as any,\n        value: parseFloat((Math.random() * 5).toFixed(3)),\n        timestamp: new Date().toISOString(),\n      };\n      addTransaction(mockTx);\n  }, [addTransaction]);`);

console.log('Fixed TSX errors');
