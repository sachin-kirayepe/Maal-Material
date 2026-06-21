const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(__dirname, "apps/api/src");
const rootDir = __dirname;

// Also clean the root level seed files and append files that failed
const extraFiles = [
  path.join(rootDir, "apps/api/append-ai-schema.js"),
  path.join(rootDir, "apps/api/prisma/seed-hyperscale.ts"),
  path.join(rootDir, "apps/api/prisma/seed-marketplace.ts"),
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  if (filePath.endsWith(".ts") || filePath.endsWith(".js")) {
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;
    // Fix \` to `
    content = content.replace(/\\`/g, "`");
    // Fix \$ to $
    content = content.replace(/\\\$/g, "$");
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log("Fixed:", filePath);
    }
  }
}

walkDir(targetDir, fixFile);
extraFiles.forEach(fixFile);
