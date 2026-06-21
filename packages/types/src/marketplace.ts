// ============================================================
// MARKETPLACE DOMAIN TYPES
// ============================================================

import type { Shop } from "./tenant";

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    listings: number;
  };
}

export interface MarketplaceListing {
  id: string;
  shopId: string;
  productId: string;
  marketplaceCategoryId: string;
  title: string;
  description: string | null;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  regionalAvailability: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shop?: Pick<Shop, "id" | "name" | "slug" | "businessType" | "logo"> & {
    address?: {
      city: string;
      state: string;
    };
  };
  category?: MarketplaceCategory;
  product?: {
    id: string;
    name: string;
    sku: string;
    image: string | null;
    sellingPrice: number;
  };
}

// ── Analytics Interfaces ────────────────────────────────────

export interface TenantAnalytics {
  totalShops: number;
  activeShops: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalListings: number;
  totalStaff: number;
}

export interface ShopAnalytics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeListings: number;
  totalStaff: number;
}

export interface MarketplaceAnalytics {
  totalListings: number;
  activeListings: number;
  featuredListings: number;
  totalCategories: number;
  listingsByCategory: Array<{
    categoryName: string;
    count: number;
  }>;
  totalShopsListing: number;
}
