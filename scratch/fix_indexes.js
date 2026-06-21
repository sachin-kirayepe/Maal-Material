const fs = require('fs');
const path = require('path');

const prismaPath = path.join(__dirname, '..', 'apps', 'api', 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(prismaPath, 'utf8');

const lines = schemaContent.split('\n');
let inModel = false;
let currentModelLines = [];
let models = [];

for (let line of lines) {
  if (line.trim().startsWith('model ')) {
    inModel = true;
    currentModelLines = [line];
  } else if (inModel) {
    currentModelLines.push(line);
    if (line.trim() === '}') {
      inModel = false;
      models.push(currentModelLines);
    }
  } else {
    models.push([line]); // non-model lines like enums, generators
  }
}

let modifiedCount = 0;

const updatedModels = models.map(block => {
  if (block[0].trim().startsWith('model ')) {
    // extract relation fields
    const relationFields = [];
    for (let line of block) {
      const match = line.match(/@relation\([^]*fields:\s*\[([^\]]+)\]/);
      if (match) {
        const fields = match[1].split(',').map(f => f.trim());
        // For composite keys, keep them together. For single, keep single.
        if (fields.length > 0 && fields[0] !== '') {
          relationFields.push(fields.join(', '));
        }
      }
    }

    // Check existing indexes
    const existingIndexes = [];
    for (let line of block) {
      const idxMatch = line.match(/@@index\(\[([^\]]+)\]\)/);
      if (idxMatch) {
        existingIndexes.push(idxMatch[1].trim());
      }
    }

    // Add missing indexes
    const missingIndexes = relationFields.filter(f => !existingIndexes.includes(f));
    
    if (missingIndexes.length > 0) {
      // Find the line before the last '}'
      const lastBraceIdx = block.length - 1;
      
      missingIndexes.forEach(idx => {
        block.splice(lastBraceIdx, 0, `  @@index([${idx}])`);
        modifiedCount++;
      });
    }
  }
  return block.join('\n');
});

const newSchema = updatedModels.join('\n');
fs.writeFileSync(prismaPath, newSchema, 'utf8');
console.log(`Successfully added ${modifiedCount} missing indexes to schema.prisma.`);
