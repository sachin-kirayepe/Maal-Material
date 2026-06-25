const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, '..', 'apps', 'web', 'src', 'app', '(dashboard)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

const newNav = `const navigationItems = [
  // 1. Dashboard & Core Tools (Universal)
  { name: "Dashboard", href: "/", icon: TerminalSquare, permission: "users:read" },
  { name: "My Shop Overview", href: "/smb-dashboard", icon: Zap, permission: "shops:read" },
  { name: "Buy Materials", href: "/marketplace", icon: ShoppingCart, permission: "marketplace:buy" },
  { name: "Manage Listings", href: "/marketplace/listings", icon: Zap, permission: "marketplace:manage" },

  // 2. Orders & Inventory (Shop Owner / Supplier)
  { name: "Order Management", href: "/orders", icon: ShoppingCart, permission: "orders:read" },
  { name: "Stock & Inventory", href: "/inventory", icon: Package, permission: "inventory:read" },
  { name: "Online Store", href: "/products", icon: ShoppingCart, permission: "products:read", isGroup: true },
  { name: "Catalog", href: "/products", icon: Package, permission: "products:read", isChild: true },
  { name: "Categories", href: "/categories", icon: Box, permission: "products:read", isChild: true },
  { name: "Cart", href: "/cart", icon: ShoppingCart, permission: "marketplace:buy", isChild: true },

  // 3. Procurement & Sourcing (Buyer / Contractor)
  { name: "Find Suppliers", href: "/sourcing", icon: Factory, permission: "sourcing:read" },
  { name: "My Vendors", href: "/vendors", icon: Globe2, permission: "vendors:read" },
  { name: "Purchase Orders", href: "/procurement", icon: ShieldCheck, permission: "procurement:read" },
  { name: "Supply Chain Insights", href: "/supply-chain", icon: Network, permission: "supplychain:read" },

  // 4. Contractor Tools (Contractor)
  { name: "Active Projects", href: "/construction", icon: HardHat, permission: "users:read" },
  { name: "Field Operations", href: "/admin/field-operations-center", icon: Pickaxe, permission: "fieldops:read" },
  { name: "Site Plans (3D)", href: "/digital-twin", icon: Box, permission: "users:read" },
  { name: "Contractor Tools", href: "/projects", icon: HardHat, permission: "projects:read", isGroup: true },
  { name: "My Projects", href: "/projects", icon: LayoutDashboard, permission: "projects:read", isChild: true },
  { name: "Work Sites", href: "/projects/sites", icon: MapPin, permission: "sites:read", isChild: true },
  { name: "Staff & Workers", href: "/projects/workers", icon: UsersIcon, permission: "workers:read", isChild: true },
  { name: "Attendance Tracking", href: "/projects/attendance", icon: Activity, permission: "attendance:manage", isChild: true },
  { name: "Material Costs", href: "/projects/materials", icon: Package, permission: "materials:manage", isChild: true },
  { name: "Project Expenses", href: "/projects/costing", icon: Wallet, permission: "costing:read", isChild: true },

  // 5. Transport & Delivery (Logistics)
  { name: "Transport & Delivery", href: "/logistics", icon: Truck, permission: "logistics:track", isGroup: true },
  { name: "My Deliveries", href: "/logistics/deliveries", icon: Package, permission: "delivery:manage", isChild: true },
  { name: "Dispatch Materials", href: "/logistics/dispatch", icon: Activity, permission: "dispatch:manage", isChild: true },
  { name: "Vehicles", href: "/logistics/fleet", icon: Truck, permission: "fleet:manage", isChild: true },
  { name: "Drivers", href: "/logistics/drivers", icon: UsersIcon, permission: "drivers:manage", isChild: true },
  { name: "Delivery Areas", href: "/logistics/shipping", icon: MapPin, permission: "shipping:manage", isChild: true },
  { name: "Delivery Reports", href: "/logistics/reports", icon: BarChart3, permission: "logistics:track", isChild: true },

  // 6. Finance & Billing (Finance / Shop Owner)
  { name: "Invoices & Billing", href: "/billing", icon: Receipt, permission: "billing:read" },
  { name: "Finance", href: "/finance", icon: BadgeDollarSign, permission: "finance:read" },
  { name: "Bank & Payments", href: "/treasury", icon: Wallet, permission: "treasury:read" },
  { name: "Tax Reports", href: "/tax", icon: Calculator, permission: "tax:read" },
  { name: "Payment Sync", href: "/reconciliation", icon: ArrowRightLeft, permission: "reconciliation:read" },
  { name: "Ledger & Accounts", href: "/ledger", icon: Wallet, permission: "ledger:read" },

  // 7. Administration (Admin)
  { name: "Reports & Analytics", href: "/predictive-intelligence", icon: Compass, permission: "users:read" },
  { name: "Global Locations", href: "/civilization-command", icon: Globe2, permission: "users:read" },
  { name: "Growth Goals", href: "/ascension", icon: Orbit, permission: "users:read" },
  { name: "Business Network", href: "/tenants", icon: Database, permission: "tenants:manage" },
  { name: "Shop Directory", href: "/shops", icon: Package, permission: "shops:read" },
  { name: "Activity Logs", href: "/activity", icon: ShieldCheck, permission: "users:read" },
  { name: "System Tasks", href: "/jobs", icon: Cpu, permission: "users:read" },
  { name: "Settings & Admin", href: "/users", icon: ShieldCheck, permission: "users:read", isGroup: true },
  { name: "Manage Users", href: "/users", icon: UsersIcon, permission: "users:read", isChild: true },
  { name: "Permissions", href: "/roles", icon: ShieldCheck, permission: "users:manage", isChild: true },
  { name: "Support & Disputes", href: "/disputes", icon: Activity, permission: "users:read" },
];`;

const startIdx = content.indexOf('const navigationItems = [');
const endIdx = content.indexOf('];', startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find navigationItems array");
  process.exit(1);
}

const before = content.slice(0, startIdx);
const after = content.slice(endIdx + 2);

content = before + newNav + after;

// Also replace CIVILIZATION CORE with MAIN NAVIGATION
content = content.replace("CIVILIZATION CORE", "MAIN NAVIGATION");

fs.writeFileSync(layoutPath, content, 'utf8');
console.log("Successfully replaced navigationItems array and header.");
