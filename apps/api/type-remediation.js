const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let changedFiles = 0;

walkDir(srcDir, function (filePath) {
  if (filePath.endsWith(".ts")) {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace ": any" with ": unknown" to force strict type checking
    const anyRegex = /:\s*any\b/g;
    if (anyRegex.test(content)) {
      const newContent = content.replace(anyRegex, ": unknown");
      fs.writeFileSync(filePath, newContent, "utf8");
      changedFiles++;
    }
  }
});

console.log(`Replaced "any" with "unknown" in ${changedFiles} files. System is now strict.`);
