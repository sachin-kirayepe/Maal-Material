const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(__dirname, "src");

walkDir(targetDir, function (filePath) {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;
    content = content.replace(/\\`/g, "`");
    content = content.replace(/\\\$/g, "$");
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log("Fixed:", filePath);
    }
  }
});
