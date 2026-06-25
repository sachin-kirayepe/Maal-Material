const fs = require('fs');

const schema = fs.readFileSync('apps/api/prisma/schema.prisma', 'utf8');
const models = schema.split(/^model /m).slice(1);

let sqlLines = [
  '-- Supabase SQL Editor Script',
  '-- Fix missing tenantId indexes to prevent P0 multi-tenant full table scans',
  'BEGIN;',
  ''
];

models.forEach(modelStr => {
  const lines = modelStr.split('\n');
  const hasTenantId = lines.some(l => l.trim().startsWith('tenantId '));
  const hasTenantIndex = lines.some(l => l.includes('@@index([tenantId])'));
  
  if (hasTenantId && hasTenantIndex) {
    // Find the table name from @@map
    const mapLine = lines.find(l => l.includes('@@map('));
    let tableName;
    if (mapLine) {
      tableName = mapLine.match(/@@map\("(.+?)"\)/)[1];
    } else {
      tableName = lines[0].split(' ')[0].trim();
    }
    
    // Add CREATE INDEX SQL
    sqlLines.push(`CREATE INDEX IF NOT EXISTS "${tableName}_tenantId_idx" ON "${tableName}"("tenantId");`);
  }
});

sqlLines.push('');
sqlLines.push('COMMIT;');

fs.writeFileSync('apply_indexes.sql', sqlLines.join('\n'), 'utf8');
console.log(`Generated apply_indexes.sql with ${sqlLines.length - 5} indexes.`);
