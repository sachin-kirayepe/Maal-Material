const fs = require('fs');

const schema = fs.readFileSync('apps/api/prisma/schema.prisma', 'utf8');
const models = schema.split('model ').slice(1);

let missingTenantIndex = [];
let totalWithTenantId = 0;

models.forEach(modelStr => {
  const lines = modelStr.split('\n');
  const modelName = lines[0].split(' ')[0].trim();
  
  const hasTenantId = lines.some(l => l.trim().startsWith('tenantId '));
  if (hasTenantId) {
    totalWithTenantId++;
    const hasTenantIndex = lines.some(l => l.includes('@@index') && l.includes('tenantId'));
    const hasTenantUnique = lines.some(l => l.includes('@@unique') && l.includes('tenantId'));
    
    if (!hasTenantIndex && !hasTenantUnique) {
      missingTenantIndex.push(modelName);
    }
  }
});

console.log(`Total models with tenantId: ${totalWithTenantId}`);
console.log(`Models MISSING tenantId index: ${missingTenantIndex.length}`);
if (missingTenantIndex.length > 0) {
  console.log('Examples:', missingTenantIndex.slice(0, 10).join(', '));
}
