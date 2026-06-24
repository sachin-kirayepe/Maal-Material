const fs = require('fs');

const schemaPath = 'apps/api/prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

const models = schema.split(/^model /m);
let newSchema = models[0]; // Generator and datasource blocks

let modifiedCount = 0;

for (let i = 1; i < models.length; i++) {
  let modelStr = 'model ' + models[i];
  const lines = modelStr.split('\n');
  
  const hasTenantId = lines.some(l => l.trim().startsWith('tenantId '));
  const hasTenantIndex = lines.some(l => l.includes('@@index') && l.includes('tenantId'));
  const hasTenantUnique = lines.some(l => l.includes('@@unique') && l.includes('tenantId'));
  const hasCompositeId = lines.some(l => l.includes('@@id') && l.includes('tenantId'));
  
  if (hasTenantId && !hasTenantIndex && !hasTenantUnique && !hasCompositeId) {
    // Find where to insert the index. Best place is right before the closing brace '}'
    const closingBraceIndex = lines.findLastIndex(l => l.trim() === '}');
    if (closingBraceIndex !== -1) {
      lines.splice(closingBraceIndex, 0, '  @@index([tenantId])');
      modifiedCount++;
    }
  }
  
  newSchema += lines.join('\n');
}

fs.writeFileSync(schemaPath, newSchema, 'utf8');
console.log(`Added @@index([tenantId]) to ${modifiedCount} models.`);
