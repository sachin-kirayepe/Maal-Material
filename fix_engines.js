const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "apps/api/src/common/engines/engines.module.ts");
let content = fs.readFileSync(filePath, "utf8");

// Remove duplicate imports
const importRegex = /^import \{ .*? \} from '.*?';$/gm;
const imports = new Set();
content = content.replace(importRegex, (match) => {
  if (imports.has(match)) {
    return ""; // Remove duplicate
  }
  imports.add(match);
  return match;
});

// Remove duplicate items in arrays (providers, exports)
let lines = content.split("\n");
let insideArray = false;
let arrayItems = new Set();

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes("providers: [") || line.includes("exports: [")) {
    insideArray = true;
    arrayItems = new Set();
  } else if (insideArray && line.includes("]")) {
    insideArray = false;
  } else if (insideArray) {
    let trimmed = line.trim();
    if (trimmed && trimmed !== ",") {
      if (arrayItems.has(trimmed) || trimmed === "ImmortalEnterpriseMemoryEngine,") {
        lines[i] = ""; // Remove duplicate or missing ImmortalEnterpriseMemoryEngine
      } else {
        arrayItems.add(trimmed);
      }
    }
  }
}

content = lines.filter((l) => l !== "").join("\n");

// Fix DatabaseModule to PrismaModule
content = content.replace(
  "import { DatabaseModule } from '../../database/database.module';",
  "import { PrismaModule } from '../../database/prisma.module';",
);
content = content.replace("imports: [DatabaseModule, EventsModule]", "imports: [PrismaModule]");
// Remove EventsModule import entirely
content = content.replace("import { EventsModule } from '../events/events.module';\n", "");

fs.writeFileSync(filePath, content, "utf8");
console.log("Fixed engines.module.ts");
