const fs = require("fs");
const path = require("path");

function revertSpread(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      revertSpread(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      if (content.includes("...(data as any)")) {
        // If it's used inside an object, like `data: { ...(data as any) }`, we should replace it.
        // We will just do `data: data as any` instead of spreading it.
        // But it's hard to regex. Let's just remove the spread and typecast the whole object.
        // Actually, if it's `{ ...(data as any) }`, we can replace `{ ...(data as any) }` with `data as any`.
        // Let's replace `\{ \.\.\.\(data as any\) \}` with `data as any`
        content = content.replace(/\{[\s\n]*\.\.\.\(data as any\),?[\s\n]*\}/g, "data as any");

        // If there are other properties like `{ ...(data as any), something: 1 }`
        // we should do `Object.assign({}, data, { something: 1 })`
        // Let's just blindly change `...(data as any),` back to `...data,`
        // NO! `...data` caused TS2698 "Spread types may only be created from object types".
        // This means `data` was `unknown`.
        // We should change `...(data as any)` to `...(data as Record<string, any>)`. This avoids the massive any expansion!
        content = content.replace(/\.\.\.\(data as any\)/g, "...(data as Record<string, any>)");
        modified = true;
      }

      if (content.includes("...(p as any)")) {
        content = content.replace(/\.\.\.\(p as any\)/g, "...(p as Record<string, any>)");
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
revertSpread(path.join(__dirname, "src"));
console.log("Reverted spread any.");
