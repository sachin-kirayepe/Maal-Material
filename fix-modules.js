const fs = require("fs");
const path = require("path");
const modulesDir = path.join(__dirname, "apps/api/src/modules");

const modules = [
  "analytics",
  "business-intelligence",
  "kpi",
  "rules-engine",
  "reports",
  "ai",
  "copilot",
  "recommendations",
  "automation",
  "insights",
];

for (const mod of modules) {
  const filePath = path.join(modulesDir, mod, mod + ".module.ts");
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (!content.includes("AuthModule")) {
      content = content.replace(
        /import { Module } from '@nestjs\/common';/,
        "import { Module } from '@nestjs/common';\nimport { AuthModule } from '../auth/auth.module';",
      );
      content = content.replace(/controllers:/, "imports: [AuthModule],\n  controllers:");
      fs.writeFileSync(filePath, content);
      console.log("Fixed", mod);
    }
  }
}
