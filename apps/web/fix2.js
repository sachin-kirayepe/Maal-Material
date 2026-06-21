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

// 1. billing/invoices/new
replaceRegex('src/app/(dashboard)/billing/invoices/new/page.tsx', /, createItem/g, '');

// 2. billing/page.tsx
replaceRegex('src/app/(dashboard)/billing/page.tsx', /, createItem/g, '');

// 3. business-intelligence
replaceRegex('src/app/(dashboard)/business-intelligence/page.tsx', /import \{ motion \} from "framer-motion";\n/g, '');
replaceRegex('src/app/(dashboard)/business-intelligence/page.tsx', /, createItem/g, '');

// 4. cart, categories
replaceRegex('src/app/(dashboard)/cart/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/categories/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/categories/page.tsx', /Badge, /g, '');

// 5. checkout
replaceRegex('src/app/(dashboard)/checkout/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/checkout/page.tsx', /const token = /g, '// const token = ');
replaceRegex('src/app/(dashboard)/checkout/page.tsx', /const checkoutRes = /g, '// const checkoutRes = ');

// 6. civilization-command
replaceRegex('src/app/(dashboard)/civilization-command/page.tsx', /, createItem/g, '');

// 7. commerce-intelligence
replaceRegex('src/app/(dashboard)/commerce-intelligence/page.tsx', /import \{ motion \} from "framer-motion";\n/g, '');

// 8. compliance
replaceRegex('src/app/(dashboard)/compliance/page.tsx', /Search, /g, '');
replaceRegex('src/app/(dashboard)/compliance/page.tsx', /, ChevronDown/g, '');

// 9. construction/analytics
replaceRegex('src/app/(dashboard)/construction/analytics/page.tsx', /import \{ motion \} from "framer-motion";\n/g, '');
replaceRegex('src/app/(dashboard)/construction/analytics/page.tsx', /, ArrowDownRight/g, '');

// 10. construction/boq
replaceRegex('src/app/(dashboard)/construction/boq/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/construction/boq/page.tsx', /, createItem/g, '');

// 11. construction/equipment
replaceRegex('src/app/(dashboard)/construction/equipment/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/construction/equipment/page.tsx', /\(eq, i\)/g, '(eq: any, i: number)');

// 12. construction/labor
replaceRegex('src/app/(dashboard)/construction/labor/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/construction/labor/page.tsx', /, createItem/g, '');
replaceRegex('src/app/(dashboard)/construction/labor/page.tsx', /\(sum, item\)/g, '(sum: number, item: any)');

// 13. construction/projects
replaceRegex('src/app/(dashboard)/construction/projects/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/construction/projects/page.tsx', /\(proj, i\)/g, '(proj: any, i: number)');

// 14. delivery
replaceRegex('src/app/(dashboard)/delivery/page.tsx', /Map, /g, '');
replaceRegex('src/app/(dashboard)/delivery/page.tsx', /AlertTriangle, /g, '');

// 15. disputes
replaceRegex('src/app/(dashboard)/disputes/page.tsx', /Badge, /g, '');

// 16. equipment
replaceRegex('src/app/(dashboard)/equipment/page.tsx', /\.\.\/\.\.\/stores/g, '@/stores');

// 17. finance
replaceRegex('src/app/(dashboard)/finance/accounting/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');
replaceRegex('src/app/(dashboard)/finance/ledger/page.tsx', /\.\.\/\.\.\/\.\.\/stores/g, '@/stores');

// 18. layout
replaceRegex('src/app/(dashboard)/layout.tsx', /const SunIcon = .*;\n/g, '');
replaceRegex('src/app/(dashboard)/layout.tsx', /const MoonIcon = .*;\n/g, '');

// 19. realtime
replaceRegex('src/app/(dashboard)/realtime/page.tsx', /devices\.length/g, 'devices?.length');

// 20. storefront
replaceRegex('src/app/(storefront)/page.tsx', /<div size=\{20\} \/>/g, '<div />');

// 21. WarehouseDigitalTwin
replaceRegex('src/components/spatial/WarehouseDigitalTwin.tsx', /, updateNode/g, '');

// 22. useWebsocketStream
replaceRegex('src/hooks/useWebsocketStream.ts', /, disconnect/g, '');

// 23. middleware
replaceRegex('src/middleware.ts', /requiredRoles\)/g, 'requiredRoles || [])');

// 24. admin/financial-command
replaceRegex('src/pages/admin/financial-command.tsx', /, isLoading/g, '');

// 25. admin/system-command
replaceRegex('src/pages/admin/system-command.tsx', /, Settings/g, '');

// 26. stores
replaceRegex('src/stores/biStore.ts', /tenantId: string/g, 'tenantId?: string');
replaceRegex('src/stores/disputeStore.ts', /async \(tenantId, id/g, 'async (_tenantId, id');

// 27. api patch/post
replaceRegex('src/stores/deviceStore.ts', /api\.patch\(`\/api\/devices\/\$\{id\}`\)/g, 'api.patch(`/api/devices/${id}`, {})');
replaceRegex('src/stores/warehouseStore.ts', /api\.post\(`\/api\/warehouse\/zones\/\$\{zoneId\}\/optimize`\)/g, 'api.post(`/api/warehouse/zones/${zoneId}/optimize`, {})');
