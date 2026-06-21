// ============================================================
// MULTI-TENANT COMMERCE DOMAIN TYPES
// ============================================================

// ── Tenant ──────────────────────────────────────────────────

export enum TenantStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  status: TenantStatus | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shops?: Shop[];
  subscriptions?: TenantSubscription[];
  _count?: {
    shops: number;
  };
}

// ── Shop ────────────────────────────────────────────────────

export enum ShopBusinessType {
  HARDWARE = "HARDWARE",
  ELECTRICAL = "ELECTRICAL",
  PAINT = "PAINT",
  PLUMBING = "PLUMBING",
  INDUSTRIAL_SUPPLY = "INDUSTRIAL_SUPPLY",
}

export enum ShopOperationalStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ONBOARDING = "ONBOARDING",
  SUSPENDED = "SUSPENDED",
}

export interface Shop {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  gstin: string | null;
  ownerName: string | null;
  businessType: ShopBusinessType | string;
  operationalStatus: ShopOperationalStatus | string;
  marketplaceVisibility: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenant?: Tenant;
  address?: ShopAddress;
  settings?: ShopSettings;
  users?: ShopUser[];
  _count?: {
    users: number;
    marketplaceListings: number;
  };
}

// ── Shop Address ────────────────────────────────────────────

export interface ShopAddress {
  id: string;
  shopId: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── Shop Settings ───────────────────────────────────────────

export interface ShopSettings {
  id: string;
  shopId: string;
  currency: string;
  timezone: string;
  taxIncludedInPrice: boolean;
  defaultTaxPercent: number;
  invoicePrefix: string | null;
  allowOnlineOrders: boolean;
  autoApproveListings: boolean;
  receiptHeader: string | null;
  receiptFooter: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Shop User ───────────────────────────────────────────────

export enum ShopUserRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CASHIER = "CASHIER",
}

export interface ShopUser {
  id: string;
  shopId: string;
  userId: string;
  role: ShopUserRole | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shop?: Shop;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
  };
}

// ── Subscription ────────────────────────────────────────────

export enum SubscriptionPlan {
  FREE = "FREE",
  ESSENTIAL = "ESSENTIAL",
  GROWTH = "GROWTH",
  ENTERPRISE = "ENTERPRISE",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELLED = "CANCELLED",
  TRIAL = "TRIAL",
}

export enum BillingCycle {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface TenantSubscription {
  id: string;
  tenantId: string;
  planName: SubscriptionPlan | string;
  status: SubscriptionStatus | string;
  billingCycle: BillingCycle | string;
  maxShops: number;
  maxProducts: number;
  maxUsers: number;
  features: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
}
