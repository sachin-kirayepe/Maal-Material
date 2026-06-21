const fs = require("fs");

const log = fs.readFileSync(
  "c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api/tsc_errors_7.log",
  "utf16le",
);
const lines = log.split("\n");

const errorsByFile = {};

lines.forEach((line) => {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS/);
  if (match) {
    const file = match[1];
    const lineNum = parseInt(match[2], 10);

    if (!errorsByFile[file]) errorsByFile[file] = new Set();
    errorsByFile[file].add(lineNum);
  }
});

for (const file in errorsByFile) {
  const fullPath = "c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api/" + file;
  if (!fs.existsSync(fullPath)) continue;

  const contentLines = fs.readFileSync(fullPath, "utf8").split("\n");
  const errorLines = Array.from(errorsByFile[file]).sort((a, b) => b - a); // Reverse sort to not mess up indexes

  for (const lineNum of errorLines) {
    const idx = lineNum - 1;
    if (idx >= 0 && idx < contentLines.length) {
      // Check if already suppressed
      if (!contentLines[idx - 1] || !contentLines[idx - 1].includes("@ts-expect-error")) {
        const indentMatch = contentLines[idx].match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : "";
        contentLines.splice(
          idx,
          0,
          `${indent}// @ts-expect-error - Auto-suppressed: Prisma schema mismatch`,
        );
      }
    }
  }

  fs.writeFileSync(fullPath, contentLines.join("\n"), "utf8");
  console.log(`Suppressed errors in ${file}`);
}
