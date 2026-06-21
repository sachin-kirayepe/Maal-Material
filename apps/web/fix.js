const fs = require('fs');

function replaceInFile(path, fromStr, toStr) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    if (content.includes(fromStr)) {
      content = content.replace(fromStr, toStr);
      fs.writeFileSync(path, content);
      console.log(`Replaced in ${path}`);
    } else {
      console.log(`String not found in ${path}`);
    }
  } catch (e) {
    console.log(`Error reading ${path}: ${e.message}`);
  }
}

// 1. construction/boq
replaceInFile('src/app/(dashboard)/construction/boq/page.tsx', 
  'const { items, meta, loading, fetchBOQs, createItem } = useBOQStore();', 
  'const { items, meta, loading, fetchBOQs } = useBOQStore();');
replaceInFile('src/app/(dashboard)/construction/boq/page.tsx', 
  'items.map((item, i)', 
  'items.map((item: any, i: number)');

// 2. construction/equipment
replaceInFile('src/app/(dashboard)/construction/equipment/page.tsx',
  "from '../../../stores/equipmentStore'",
  "from '@/stores/equipmentStore'");
replaceInFile('src/app/(dashboard)/construction/equipment/page.tsx',
  'equipment.map((eq, i)',
  'equipment.map((eq: any, i: number)');

// 3. construction/labor
replaceInFile('src/app/(dashboard)/construction/labor/page.tsx',
  "from '../../../stores/workerStore'",
  "from '@/stores/workerStore'");
replaceInFile('src/app/(dashboard)/construction/labor/page.tsx',
  'const { workers, meta, loading, fetchWorkers, createItem } = useWorkerStore();',
  'const { workers, meta, loading, fetchWorkers } = useWorkerStore();');
replaceInFile('src/app/(dashboard)/construction/labor/page.tsx',
  'workers.reduce((sum, item) => sum + item.cost, 0)',
  'workers.reduce((sum: number, item: any) => sum + item.cost, 0)');
replaceInFile('src/app/(dashboard)/construction/labor/page.tsx',
  'workers.map((worker, i)',
  'workers.map((worker: any, i: number)');

// 4. construction/material-log
replaceInFile('src/app/(dashboard)/construction/material-log/page.tsx',
  ', createItem }',
  ' }');

// 5. construction/project-costing
replaceInFile('src/app/(dashboard)/construction/project-costing/page.tsx',
  ', TrendingUp',
  '');

// 6. construction/projects
replaceInFile('src/app/(dashboard)/construction/projects/page.tsx',
  "from '../../../stores/projectStore'",
  "from '@/stores/projectStore'");
replaceInFile('src/app/(dashboard)/construction/projects/page.tsx',
  'projects.map((proj, i)',
  'projects.map((proj: any, i: number)');

// 7. construction/site-operations
replaceInFile('src/app/(dashboard)/construction/site-operations/page.tsx',
  'import { motion } from "framer-motion";\n',
  '');
replaceInFile('src/app/(dashboard)/construction/site-operations/page.tsx',
  ', createItem } = useSiteOpsStore();',
  ' } = useSiteOpsStore();');

// 8. customers
replaceInFile('src/app/(dashboard)/customers/page.tsx',
  ', createItem } = useCustomerStore();',
  ' } = useCustomerStore();');

// 9. delivery
replaceInFile('src/app/(dashboard)/delivery/page.tsx',
  ', Map,',
  ',');
replaceInFile('src/app/(dashboard)/delivery/page.tsx',
  'AlertTriangle,',
  '');

// 10. device-management
replaceInFile('src/app/(dashboard)/device-management/page.tsx',
  'import React, { useState } from "react";',
  'import React from "react";');

// 11. digital-exchange
replaceInFile('src/app/(dashboard)/digital-exchange/page.tsx',
  ', Clock, ArrowRight, DollarSign',
  '');

// 12. disputes
replaceInFile('src/app/(dashboard)/disputes/page.tsx',
  'Badge, ',
  '');
replaceInFile('src/app/(dashboard)/disputes/page.tsx',
  ', createItem } = useDisputeStore();',
  ' } = useDisputeStore();');

// 13. equipment
replaceInFile('src/app/(dashboard)/equipment/page.tsx',
  "from '../../stores/equipmentStore'",
  "from '@/stores/equipmentStore'");
replaceInFile('src/app/(dashboard)/equipment/page.tsx',
  ', createItem } = useEquipmentStore();',
  ' } = useEquipmentStore();');

// 14. finance/accounting
replaceInFile('src/app/(dashboard)/finance/accounting/page.tsx',
  "from '../../../stores/accountingStore'",
  "from '@/stores/accountingStore'");
replaceInFile('src/app/(dashboard)/finance/accounting/page.tsx',
  ', createItem } = useAccountingStore();',
  ' } = useAccountingStore();');

// 15. finance/credit
replaceInFile('src/app/(dashboard)/finance/credit/page.tsx',
  ', Clock',
  '');

// 16. finance/ledger
replaceInFile('src/app/(dashboard)/finance/ledger/page.tsx',
  "from '../../../stores/ledgerStore'",
  "from '@/stores/ledgerStore'");
replaceInFile('src/app/(dashboard)/finance/ledger/page.tsx',
  ', createItem } = useLedgerStore();',
  ' } = useLedgerStore();');

// 17. finance/settlements
replaceInFile('src/app/(dashboard)/finance/settlements/page.tsx',
  'checked={selectedSuppliers.length === records.length && records.length > 0}',
  'checked={(selectedSuppliers.length === records.length && records.length > 0) || undefined}');

// 18. layout
replaceInFile('src/app/(dashboard)/layout.tsx',
  'import { useTheme } from "next-themes";\n',
  '');
replaceInFile('src/app/(dashboard)/layout.tsx',
  'const SunIcon = SunIconImport as any;\nconst MoonIcon = MoonIconImport as any;\n',
  '');

// 19. realtime
replaceInFile('src/app/(dashboard)/realtime/page.tsx',
  'devices.length',
  'devices?.length');

// 20, 21, 22. security, sourcing, stock
replaceInFile('src/app/(dashboard)/security/page.tsx',
  'import { motion } from "framer-motion";\n',
  '');
replaceInFile('src/app/(dashboard)/sourcing/page.tsx',
  'import { motion } from "framer-motion";\n',
  '');
replaceInFile('src/app/(dashboard)/stock/page.tsx',
  'import { motion } from "framer-motion";\n',
  '');

// 23. storefront
replaceInFile('src/app/(storefront)/page.tsx',
  '<HardHat',
  '<div');
replaceInFile('src/app/(storefront)/page.tsx',
  '</HardHat>',
  '</div>');

// 24. WarehouseDigitalTwin
replaceInFile('src/components/spatial/WarehouseDigitalTwin.tsx',
  'const { nodes, fetchNodes, updateNode } = useDigitalTwinStore();',
  'const { nodes, fetchNodes } = useDigitalTwinStore();');

// 25. DonutChart
replaceInFile('src/components/ui/DonutChart.tsx',
  'data.map((entry, index)',
  'data.map((_, index)');

// 26. useWebsocketStream
replaceInFile('src/hooks/useWebsocketStream.ts',
  'const { status, connect, disconnect, addTopic }',
  'const { status, connect, addTopic }');

// 27. middleware.ts
replaceInFile('src/middleware.ts',
  'if (!hasRequiredRole(user, requiredRoles))',
  'if (!hasRequiredRole(user, requiredRoles || []))');

// 29. admin/financial-command
replaceInFile('src/pages/admin/financial-command.tsx',
  'const { metrics, isLoading, fetchMetrics } = useFinancialCommandStore();',
  'const { metrics, fetchMetrics } = useFinancialCommandStore();');

// 30. admin/logistics-command
replaceInFile('src/pages/admin/logistics-command.tsx',
  ', Search',
  '');

// 31. admin/system-command
replaceInFile('src/pages/admin/system-command.tsx',
  ', Settings',
  '');

// 32. admin/vendor-exchange
replaceInFile('src/pages/admin/vendor-exchange.tsx',
  ', Award',
  '');

// 33. planetary-telemetry-store
replaceInFile('src/store/planetary-telemetry-store.ts',
  '(set, get) =>',
  '(set) =>');

// 35. approvalStore
replaceInFile('src/stores/approvalStore.ts',
  '(set, get) =>',
  '(set) =>');

// 36. biStore
replaceInFile('src/stores/biStore.ts',
  'fetchInsights: async (tenantId) => {',
  'fetchInsights: async () => {');
replaceInFile('src/stores/biStore.ts',
  'generateReport: async (tenantId, reportType) => {',
  'generateReport: async (reportType) => {');

// 37. deviceStore
replaceInFile('src/stores/deviceStore.ts',
  'api.patch(`/api/devices/${id}`)',
  'api.patch(`/api/devices/${id}`, {})');

// 38. warehouseStore
replaceInFile('src/stores/warehouseStore.ts',
  'api.post(`/api/warehouse/zones/${zoneId}/optimize`)',
  'api.post(`/api/warehouse/zones/${zoneId}/optimize`, {})');

// 39. workflowsStore
replaceInFile('src/stores/workflowsStore.ts',
  'fetchWorkflows: async (tenantId) => {',
  'fetchWorkflows: async () => {');

console.log("Fixes complete!");
