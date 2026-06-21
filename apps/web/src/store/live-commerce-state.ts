import { create } from "zustand";

export interface IndustrialProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  availableStock: number;
  supplier: string;
  trend: "UP" | "DOWN" | "STABLE";
  reliabilityScore: number;
  deliveryEtaDays: number;
  tags: string[];
}

export interface ProcurementDraft {
  items: Array<{ productId: string; quantity: number }>;
  destination: string;
  priority: "ROUTINE" | "EXPEDITED" | "CRITICAL";
}

interface LiveCommerceState {
  // Inventory State
  products: Record<string, IndustrialProduct>;
  setProducts: (products: IndustrialProduct[]) => void;
  updateProductStock: (id: string, newStock: number, trend?: "UP" | "DOWN") => void;
  updateProductPrice: (id: string, newPrice: number) => void;

  // Active Drafts/Cart
  procurementDraft: ProcurementDraft;
  addItemToDraft: (productId: string, quantity: number) => void;
  removeItemFromDraft: (productId: string) => void;
  setDraftPriority: (priority: ProcurementDraft["priority"]) => void;
  setDraftDestination: (destination: string) => void;
  clearDraft: () => void;

  // Cinematic Checkout UI State
  isCheckoutOpen: boolean;
  setCheckoutOpen: (isOpen: boolean) => void;
}

import { apiClient } from "@/lib/api-client";

// MOCK_PRODUCTS removed. Data will be fetched from API.

export const useLiveCommerceStore = create<LiveCommerceState & { fetchProducts: () => Promise<void> }>((set) => ({
  products: {},
  setProducts: (products) =>
    set({ products: products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}) }),
  fetchProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      const apiProducts = response.data.data.items || response.data.data;
      if (Array.isArray(apiProducts)) {
        const mappedProducts: IndustrialProduct[] = apiProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category?.name || "General",
          basePrice: p.purchasePrice || 0,
          currentPrice: p.sellingPrice || 0,
          availableStock: p.minimumStock || 0, // Fallback until warehouse stock is merged
          supplier: "ConstructOS Vendor",
          trend: "STABLE",
          reliabilityScore: 95,
          deliveryEtaDays: 3,
          tags: [],
        }));
        set({ products: mappedProducts.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}) });
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
  },

  updateProductStock: (id, newStock, trend) =>
    set((state) => {
      const product = state.products[id];
      if (!product) return state;
      return {
        products: {
          ...state.products,
          [id]: { ...product, availableStock: newStock, trend: trend || product.trend },
        },
      };
    }),

  updateProductPrice: (id, newPrice) =>
    set((state) => {
      const product = state.products[id];
      if (!product) return state;
      const trend =
        newPrice > product.currentPrice
          ? "UP"
          : newPrice < product.currentPrice
            ? "DOWN"
            : "STABLE";
      return {
        products: {
          ...state.products,
          [id]: { ...product, currentPrice: newPrice, trend },
        },
      };
    }),

  procurementDraft: { items: [], destination: "Sector 4 Depot", priority: "ROUTINE" },

  addItemToDraft: (productId, quantity) =>
    set((state) => {
      const existing = state.procurementDraft.items.find((i) => i.productId === productId);
      const newItems = existing
        ? state.procurementDraft.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...state.procurementDraft.items, { productId, quantity }];
      return { procurementDraft: { ...state.procurementDraft, items: newItems } };
    }),

  removeItemFromDraft: (productId) =>
    set((state) => ({
      procurementDraft: {
        ...state.procurementDraft,
        items: state.procurementDraft.items.filter((i) => i.productId !== productId),
      },
    })),

  setDraftPriority: (priority) =>
    set((state) => ({
      procurementDraft: { ...state.procurementDraft, priority },
    })),

  setDraftDestination: (destination) =>
    set((state) => ({
      procurementDraft: { ...state.procurementDraft, destination },
    })),

  clearDraft: () =>
    set((state) => ({
      procurementDraft: { ...state.procurementDraft, items: [] },
    })),

  isCheckoutOpen: false,
  setCheckoutOpen: (isOpen) => set({ isCheckoutOpen: isOpen }),
}));
