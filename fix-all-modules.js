const fs = require("fs");
const path = require("path");
const modulesDir = path.join(__dirname, "apps/api/src/modules");

const modules = fs.readdirSync(modulesDir);

for (const mod of modules) {
  const filePath = path.join(modulesDir, mod, mod + ".module.ts");
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (mod === "auth") continue;

    const controllerPath = path.join(modulesDir, mod, mod + ".controller.ts");
    let needsAuthModule = false;
    if (fs.existsSync(controllerPath)) {
      const controllerContent = fs.readFileSync(controllerPath, "utf8");
      if (controllerContent.includes("AuthGuard") || controllerContent.includes("DevAuthGuard")) {
        needsAuthModule = true;
      }
    }

    if (needsAuthModule && !content.includes("AuthModule")) {
      content = content.replace(
        /import { Module } from '@nestjs\/common';/,
        "import { Module } from '@nestjs/common';\nimport { AuthModule } from '../auth/auth.module';",
      );

      if (content.includes("imports: [")) {
        content = content.replace(/imports: \[\s*/, "imports: [AuthModule, ");
      } else {
        content = content.replace(/controllers:/, "imports: [AuthModule],\n  controllers:");
      }

      fs.writeFileSync(filePath, content);
      console.log("Fixed", mod);
    }
  }
}
