const fs = require("fs");
const path = require("path");

const projectRoot = "c:/Users/asus/OneDrive/Desktop/ConstructOs";
const apiPath = path.join(projectRoot, "apps/api/src");
const webPath = path.join(projectRoot, "apps/web/src");
const schemaPath = path.join(projectRoot, "apps/api/prisma/schema.prisma"); // Assuming this is the location

// Scrapers
function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach((file) => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!file.includes("node_modules") && !file.includes(".next")) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const allWebFiles = walkSync(webPath);
const allApiFiles = walkSync(apiPath);

let dbModels = [];
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, "utf8");
  const matches = schemaContent.match(/model\s+(\w+)\s+{/g);
  if (matches) {
    dbModels = matches.map((m) => m.replace("model ", "").replace(" {", "").trim());
  }
}

// 1. Architecture Map Data
const backendControllers = allApiFiles.filter((f) => f.includes(".controller.ts"));
const frontendPages = allWebFiles.filter(
  (f) => f.includes("page.tsx") || (f.includes(".tsx") && f.includes("pages")),
);
const stateStores = allWebFiles.filter((f) => f.includes("stores") && f.endsWith(".ts"));

let endpoints = [];
backendControllers.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const classMatch = content.match(/@Controller\(["'](.*?)["']\)/);
  if (classMatch) {
    let basePath = classMatch[1];
    const methodMatches = [
      ...content.matchAll(/@(Get|Post|Put|Patch|Delete)\((["'](.*?)["'])?\)/g),
    ];
    methodMatches.forEach((m) => {
      endpoints.push({
        method: m[1],
        path: `/${basePath}` + (m[3] ? `/${m[3]}` : ""),
        file: path.basename(file),
      });
    });
  }
});

// 2. Traceability & Fake Data
let fakeDataInstances = [];
let missingApiLinks = [];

stateStores.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  if (
    content.includes("Math.random") ||
    content.includes("setTimeout") ||
    content.includes("Promise.resolve")
  ) {
    fakeDataInstances.push({ file: path.basename(file), type: "Mock State Data" });
  }
  // Check API calls
  if (
    !content.includes("fetch(") &&
    !content.includes("api.get") &&
    !content.includes("api.post") &&
    !content.includes("ApiClient.get") &&
    !content.includes("ApiClient.post") &&
    !content.includes("ApiClient.put") &&
    !content.includes("ApiClient.delete")
  ) {
    missingApiLinks.push(path.basename(file));
  }
});

frontendPages.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("Math.random") || content.includes("setTimeout")) {
    fakeDataInstances.push({ file: path.basename(file), type: "Mock UI Data" });
  }
});

// Calculate Scores
const scoreFakeData = 100 - fakeDataInstances.length * 2;
const scoreIntegrations = 100 - missingApiLinks.length * 5;
const scoreDB = dbModels.length > 0 ? 95 : 0; // rough heuristic

const finalOutput = {
  Architecture: {
    FrontendScreensCount: frontendPages.length,
    BackendEndpointsCount: endpoints.length,
    StateStoresCount: stateStores.length,
    DatabaseModelsCount: dbModels.length,
  },
  Traceability: {
    UnconnectedStores: missingApiLinks,
  },
  FakeData: fakeDataInstances,
  EndpointsFound: endpoints.slice(0, 10).map((e) => `${e.method} ${e.path}`), // Sample 10
};

fs.writeFileSync(
  path.join(projectRoot, "audit_results.json"),
  JSON.stringify(finalOutput, null, 2),
);
console.log("Audit data generated at audit_results.json");
