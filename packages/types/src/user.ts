export enum SystemRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SHOP_OWNER = "SHOP_OWNER",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  DRIVER = "DRIVER",
  CONTRACTOR = "CONTRACTOR",
  CUSTOMER = "CUSTOMER",

  // Backward compatibility support for dashboard
  ORG_ADMIN = "ORG_ADMIN",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  BILLING_CLERK = "BILLING_CLERK",
  FIELD_USER = "FIELD_USER",
}

export enum SystemPermission {
  // User Management
  USERS_CREATE = "users:create",
  USERS_READ = "users:read",
  USERS_UPDATE = "users:update",
  USERS_DELETE = "users:delete",

  // Inventory Management
  INVENTORY_CREATE = "inventory:create",
  INVENTORY_READ = "inventory:read",
  INVENTORY_UPDATE = "inventory:update",
  INVENTORY_DELETE = "inventory:delete",

  // Billing & Finance
  BILLING_CREATE = "billing:create",
  BILLING_READ = "billing:read",
  BILLING_UPDATE = "billing:update",
  BILLING_DELETE = "billing:delete",

  // Procurement & Marketplace
  MARKETPLACE_BUY = "marketplace:buy",
  MARKETPLACE_SELL = "marketplace:sell",
  MARKETPLACE_MANAGE = "marketplace:manage",

  // Logistics
  LOGISTICS_DISPATCH = "logistics:dispatch",
  LOGISTICS_TRACK = "logistics:track",

  // System Org Control
  ORG_MANAGE = "org:manage",
  SYSTEM_SETTINGS = "system:settings",

  // Multi-Tenant Commerce
  TENANTS_MANAGE = "tenants:manage",
  SHOPS_CREATE = "shops:create",
  SHOPS_READ = "shops:read",
  SHOPS_MANAGE = "shops:manage",
  SHOP_USERS_MANAGE = "shop-users:manage",
  SUBSCRIPTIONS_MANAGE = "subscriptions:manage",
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  roleId?: string; // Optional for multi-role environments
  role?: Role; // Primary role
  roles?: Role[]; // Multi-role support
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Role {
  id: string;
  name: SystemRole | string;
  description: string | null;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  action: SystemPermission | string;
  description: string | null;
  createdAt: string;
}
