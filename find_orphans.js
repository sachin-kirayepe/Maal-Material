const fs = require("fs");
const path = require("path");

const apiModulesDir = path.join(__dirname, "apps/api/src/modules");
const webAppDir = path.join(__dirname, "apps/web/src/app/(dashboard)");
const webPagesDir = path.join(__dirname, "apps/web/src/pages/admin");

// Get all backend modules
const backendModules = fs
  .readdirSync(apiModulesDir)
  .filter((f) => fs.statSync(path.join(apiModulesDir, f)).isDirectory());

// Recursively get all frontend page routes
function getFrontendRoutes(dir, basePath) {
  let routes = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      routes = routes.concat(getFrontendRoutes(fullPath, `${basePath}/${file}`));
    } else if (file === "page.tsx" || file.endsWith(".tsx")) {
      let routeName = basePath.split("/").pop();
      if (file !== "page.tsx") {
        routeName = file.replace(".tsx", "");
      }
      if (routeName && routeName !== "admin" && routeName !== "") {
        routes.push(routeName);
      }
    }
  }
  return [...new Set(routes)];
}

const appRoutes = getFrontendRoutes(webAppDir, "");
const pageRoutes = getFrontendRoutes(webPagesDir, "");
const allFrontendRoutes = [...new Set([...appRoutes, ...pageRoutes])];

// Basic fuzzy matching
const orphanedBackends = backendModules.filter(
  (bm) => !allFrontendRoutes.some((fr) => fr.includes(bm) || bm.includes(fr)),
);
const orphanedFrontends = allFrontendRoutes.filter(
  (fr) => !backendModules.some((bm) => bm.includes(fr) || fr.includes(bm)),
);

const report = {
  totalBackendModules: backendModules.length,
  totalFrontendRoutes: allFrontendRoutes.length,
  orphanedBackends: orphanedBackends,
  orphanedFrontends: orphanedFrontends,
};

console.log(JSON.stringify(report, null, 2));
