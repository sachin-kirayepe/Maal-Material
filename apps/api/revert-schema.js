const fs = require("fs");

const path = "prisma/schema.prisma";
let content = fs.readFileSync(path, "utf8");

const marker =
  "// ====================================================\n// CONSTRUCTION EXECUTION & SITE OPERATIONS";
const index = content.indexOf(marker);

if (index !== -1) {
  content = content.substring(0, index);
  fs.writeFileSync(path, content, "utf8");
  console.log("Reverted appended content");
} else {
  console.log("Marker not found");
}
