const fs = require("fs");

const errorsContent = fs.readFileSync("tsc-errors.txt", "utf8");
const lines = errorsContent.split(/\r?\n/);
let matchCount = 0;

for (let i = 0; i < 20; i++) {
  console.log("LINE: " + lines[i]);
  const match = lines[i].match(
    /^(.+?)\((\d+),(\d+)\): error TS\d+: (.*?) Did you mean(?: to write)? '(.*?)'\?/,
  );
  console.log("MATCH: " + (match ? "YES" : "NO"));
}
