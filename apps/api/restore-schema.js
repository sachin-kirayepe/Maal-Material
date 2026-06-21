const fs = require("fs");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Restore @default(uuid())
schema = schema.replace(/id\s+String\s+@id(\s*(?!@default))/g, "id String @id @default(uuid())$1");

// Restore @updatedAt
// Be careful to match `updatedAt DateTime` at the end of the line or followed by space
schema = schema.replace(/updatedAt\s+DateTime(?!\s*@updatedAt)/g, "updatedAt DateTime @updatedAt");

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("Restored UUIDs and updatedAts");
