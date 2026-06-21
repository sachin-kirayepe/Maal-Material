const fs = require("fs");
const path = require("path");

const projectRoot = "c:/Users/asus/OneDrive/Desktop/ConstructOs";
const apiPath = path.join(projectRoot, "apps/api/src/modules");

const disconnectedStores = [
  "aiNegotiationStore.ts",
  "attendanceStore.ts",
  "contractorAnalyticsStore.ts",
  "disputesStore.ts",
  "equipmentStore.ts",
  "fraudStore.ts",
  "intelligenceStore.ts",
  "inventorySharingStore.ts",
  "predictionsStore.ts",
  "projectCostingStore.ts",
  "recommendationsStore.ts",
  "rentalRfqStore.ts",
  "rentalsStore.ts",
  "riskAnalysisStore.ts",
  "riskAssessmentStore.ts",
  "smbStore.ts",
  "supplyChainStore.ts",
  "syncStore.ts",
  "trustStore.ts",
  "vendorDiscoveryStore.ts",
  "websocketStore.ts",
  "whatsappStore.ts",
];

function findController(searchTerm) {
  if (!fs.existsSync(apiPath)) return null;
  const modules = fs.readdirSync(apiPath);
  for (const mod of modules) {
    if (
      mod.toLowerCase().includes(searchTerm) ||
      searchTerm.toLowerCase().includes(mod.toLowerCase().replace("-", ""))
    ) {
      const modPath = path.join(apiPath, mod);
      if (fs.statSync(modPath).isDirectory()) {
        return modPath;
      }
    }
  }
  return null;
}

let mappings = [];

disconnectedStores.forEach((store) => {
  const baseName = store.replace("Store.ts", "").toLowerCase();
  const controllerPath = findController(baseName);
  mappings.push({
    store,
    baseName,
    foundController: controllerPath ? path.basename(controllerPath) : "NOT FOUND",
  });
});

console.log(JSON.stringify(mappings, null, 2));
