const fs = require('fs');

function replaceRegex(path, regex, replaceStr) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, replaceStr);
      fs.writeFileSync(path, content);
      console.log(`Replaced in ${path}`);
    } else {
      console.log(`Regex not matched in ${path}`);
    }
  } catch (e) {
    console.log(`Error reading ${path}`);
  }
}

// 2. scripts/clean-realtime.ts
replaceRegex('scripts/clean-realtime.ts', /const originalContent = /g, '// const originalContent = ');

// 3. (auth)/layout.tsx
replaceRegex('src/app/(auth)/layout.tsx', /  BadgeDollarSign as BadgeDollarSignIcon,\n  Calculator as CalculatorIcon,\n  ArrowRightLeft as ArrowRightLeftIcon,\n  Network as NetworkIcon,\n  Factory as FactoryIcon,\n  Globe2 as Globe2Icon,\n  Pickaxe as PickaxeIcon,\n/g, '');

// 4. activity
replaceRegex('src/app/(dashboard)/activity/page.tsx', /, createItem/g, '');

// 5. admin/analytics
replaceRegex('src/app/(dashboard)/admin/analytics/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/admin/analytics/page.tsx', /, trends/g, '');
replaceRegex('src/app/(dashboard)/admin/analytics/page.tsx', /, createItem/g, '');

// 6. admin/rbac
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /, ChevronDown/g, '');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\(r\)/g, '(r: any)');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\(acc, perm\)/g, '(acc: any, perm: any)');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\(role\)/g, '(role: any)');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /modulePerms/g, '(modulePerms as any)');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\(perm\)/g, '(perm: any)');
replaceRegex('src/app/(dashboard)/admin/rbac/page.tsx', /\(p\)/g, '(p: any)');

// 7. admin/workflows
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /import React, \{ useState \} from "react";/g, 'import React from "react";');
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /, ChevronRight/g, '');
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /<Clock/g, '<div');
replaceRegex('src/app/(dashboard)/admin/workflows/page.tsx', /<\/Clock>/g, '</div>');

// 8. ai
replaceRegex('src/app/(dashboard)/ai/alerts/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/ai/automation/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/ai/command-center/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/ai/copilot/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/ai/recommendations/page.tsx', /, createItem/g, '');

// 9. analytics
replaceRegex('src/app/(dashboard)/analytics/page.tsx', /import React, \{ useState \} from "react";/g, 'import React from "react";');
replaceRegex('src/app/(dashboard)/analytics/page.tsx', /, LayoutDashboard/g, '');
replaceRegex('src/app/(dashboard)/analytics/page.tsx', /, Plus/g, '');

// 10. ascension
replaceRegex('src/app/(dashboard)/ascension/page.tsx', /, _triggerEvolutionEvent/g, '');
replaceRegex('src/app/(dashboard)/ascension/page.tsx', /, createItem/g, '');

// 11. checkout
replaceRegex('src/app/(dashboard)/checkout/page.tsx', /import \{ useAuthStore \} from "@\/stores\/authStore";\n/g, '');

// 12. boq, equipment, accounting, ledger
replaceRegex('src/app/(dashboard)/construction/boq/page.tsx', /=== items\.length && items\.length > 0\}/g, '=== items.length && items.length > 0) || undefined}');
replaceRegex('src/app/(dashboard)/equipment/page.tsx', /=== equipment\.length && equipment\.length > 0\}/g, '=== equipment.length && equipment.length > 0) || undefined}');
replaceRegex('src/app/(dashboard)/finance/accounting/page.tsx', /=== journals\.length && journals\.length > 0\}/g, '=== journals.length && journals.length > 0) || undefined}');
replaceRegex('src/app/(dashboard)/finance/ledger/page.tsx', /=== ledgers\.length && ledgers\.length > 0\}/g, '=== ledgers.length && ledgers.length > 0) || undefined}');
