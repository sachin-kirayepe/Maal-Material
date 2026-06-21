const fs = require('fs');

try {
  let c = fs.readFileSync('e2e/procurement.spec.ts', 'utf8');
  c = c.replace(/import { test, expect }/, 'import { test }');
  fs.writeFileSync('e2e/procurement.spec.ts', c);
} catch (e) {}

try {
  let c = fs.readFileSync('scripts/clean-realtime.ts', 'utf8');
  c = c.replace(/const originalContent =/, '// const originalContent =');
  fs.writeFileSync('scripts/clean-realtime.ts', c);
} catch (e) {}

try {
  let c = fs.readFileSync('src/app/(auth)/layout.tsx', 'utf8');
  c = c.replace(/  BadgeDollarSign as BadgeDollarSignIcon,\n  Calculator as CalculatorIcon,\n  ArrowRightLeft as ArrowRightLeftIcon,\n  Network as NetworkIcon,\n  Factory as FactoryIcon,\n  Globe2 as Globe2Icon,\n  Pickaxe as PickaxeIcon,\n/g, '');
  fs.writeFileSync('src/app/(auth)/layout.tsx', c);
} catch (e) {}

try {
  let c = fs.readFileSync('src/app/(dashboard)/admin/rbac/page.tsx', 'utf8');
  c = c.replace(/setActiveRoleName\(roles\[0\]\.name\);/, 'setActiveRoleName(roles[0]?.name || "");');
  fs.writeFileSync('src/app/(dashboard)/admin/rbac/page.tsx', c);
} catch (e) {}

try {
  let c = fs.readFileSync('src/app/(dashboard)/admin/workflows/page.tsx', 'utf8');
  c = c.replace(/import React, { useState } from "react";/, 'import React from "react";');
  c = c.replace(/<div size={20} className="text-zinc-500" \/>/g, '<div className="text-zinc-500" />');
  fs.writeFileSync('src/app/(dashboard)/admin/workflows/page.tsx', c);
} catch (e) {}

try {
  let c = fs.readFileSync('src/app/(dashboard)/ascension/page.tsx', 'utf8');
  c = c.replace(/, _triggerEvolutionEvent/g, '');
  fs.writeFileSync('src/app/(dashboard)/ascension/page.tsx', c);
} catch (e) {}

try {
  let c = fs.readFileSync('src/app/(dashboard)/checkout/page.tsx', 'utf8');
  c = c.replace(/import { useAuthStore } from "@\/stores\/authStore";\n/g, '');
  fs.writeFileSync('src/app/(dashboard)/checkout/page.tsx', c);
} catch (e) {}

function fixNullBoolean(path, varName) {
  try {
    let cc = fs.readFileSync(path, 'utf8');
    let regex = new RegExp(`=== ${varName}\\.length && ${varName}\\.length > 0\\}`, 'g');
    cc = cc.replace(regex, `=== ${varName}.length && ${varName}.length > 0) || undefined}`);
    fs.writeFileSync(path, cc);
  } catch (e) {}
}

fixNullBoolean('src/app/(dashboard)/construction/boq/page.tsx', 'items');
fixNullBoolean('src/app/(dashboard)/equipment/page.tsx', 'equipment');
fixNullBoolean('src/app/(dashboard)/finance/accounting/page.tsx', 'journals');
fixNullBoolean('src/app/(dashboard)/finance/ledger/page.tsx', 'ledgers');

console.log("Done");
