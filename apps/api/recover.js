const fs = require("fs");

const files = [
  "src/modules/b2b-marketplace/b2b-marketplace.service.ts",
  "src/modules/categories/categories.service.ts",
  "src/modules/checkout/checkout.service.ts",
  "src/modules/delivery/delivery.service.ts",
  "src/modules/ecosystem/ecosystem.service.ts",
  "src/modules/marketplace/marketplace.service.ts",
  "src/modules/procurement/procurement.service.ts",
  "src/modules/project-costing/project-costing.service.ts",
  "src/modules/purchases/purchases.service.ts",
  "src/modules/rentals/rentals.service.ts",
  "src/modules/shops/shops.service.ts",
  "src/modules/sourcing/sourcing.service.ts",
  "src/modules/warehouses/warehouses.service.ts",
];

const badKeys = [
  "products:",
  "projects:",
  "users:",
  "tenants:",
  "tasks:",
  "vendors:",
  "vehicles:",
  "companies:",
  "clients:",
  "marketplaceCategories:",
  "drivers:",
  "employees:",
  "equipment:",
  "purchaseOrders:",
  "deliveries:",
  "warehouses:",
  "invoices:",
];

files.forEach((file) => {
  let content = fs.readFileSync(
    "c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api/" + file,
    "utf8",
  );
  let original = content;

  // We are looking for "products: " where it is immediately followed by a comma or newline or 'include:' or 'select:'
  // For example: `products: ,` -> `products: true,`
  // `products: include: ` -> `products: { include: `
  // `products: select: ` -> `products: { select: `
  // `products: \n` -> `products: true\n` or `products: true, \n`

  badKeys.forEach((key) => {
    const regexComma = new RegExp(`${key}\\s*,`, "g");
    content = content.replace(regexComma, `${key} true,`);

    const regexInclude = new RegExp(`${key}\\s*include:`, "g");
    content = content.replace(regexInclude, `${key} { include:`);

    const regexSelect = new RegExp(`${key}\\s*select:`, "g");
    content = content.replace(regexSelect, `${key} { select:`);

    const regexWhere = new RegExp(`${key}\\s*where:`, "g");
    content = content.replace(regexWhere, `${key} { where:`);

    // Sometimes it's the last item in the object
    const regexBrace = new RegExp(`${key}\\s*\\}`, "g");
    content = content.replace(regexBrace, `${key} true }`);

    const regexNewline = new RegExp(`${key}\\s*\\n`, "g");
    content = content.replace(regexNewline, `${key} true,\n`);
  });

  if (content !== original) {
    fs.writeFileSync(
      "c:/Users/asus/OneDrive/Desktop/ConstructOs/apps/api/" + file,
      content,
      "utf8",
    );
    console.log("Recovered: " + file);
  }
});
