const fs = require("fs");

const errorsContent = fs.readFileSync("tsc-errors2.txt", "utf16le");
const lines = errorsContent.split(/\r?\n/);

const errorCounts = {};
let srcErrorCount = 0;

for (const line of lines) {
  if (line.startsWith("src/")) {
    srcErrorCount++;
    const match = line.match(/: error TS\d+: (.*)/);
    if (match) {
      const msg = match[1].replace(/ Did you mean.*/, "");
      errorCounts[msg] = (errorCounts[msg] || 0) + 1;
    }
  }
}

console.log(`Total src errors: ${srcErrorCount}`);
const sorted = Object.entries(errorCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);
for (const [msg, count] of sorted) {
  console.log(`${count}: ${msg}`);
}
