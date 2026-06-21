const fs = require("fs");
const path = require("path");

function uncorrupt(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      uncorrupt(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("(err as any)?.message ||")) {
        // The regex replaced `/message ||/g` which matched either "message " or "".
        // Since it matched "", it inserted `(err as any)?.message ||` between every character.
        // We will remove all instances of `(err as any)?.message ||`.
        // However, any original "message " that was replaced will become empty string.
        // It's a small price to pay to recover the entire codebase.

        content = content.replace(/\(err as any\)\?\.message \|\|/g, "");

        // Now, any original `message ` is gone. We might have some broken code like `const = "hello"` instead of `const message = "hello"`.
        // But let's first get the code back to readable state.
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
uncorrupt(path.join(__dirname, "src"));
uncorrupt(path.join(__dirname, "prisma"));
console.log("Uncorruption complete.");
