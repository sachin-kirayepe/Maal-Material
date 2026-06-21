import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface MarketplaceStore {
  storefronts: any[];
  orders: any[];
  fetchStorefronts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  storefronts: [],
  orders: [],
  fetchStorefronts: async () => {
    try {
      const data = await ApiClient.get<any>("/b2b-marketplace/storefronts");
      set({ storefronts: data.data || data || [] });
    } catch (e) {
      console.error("Failed to fetch storefronts", e);
    }
  },
  fetchOrders: async () => {
    try {
      const data = await ApiClient.get<any>("/b2b-marketplace/orders");
      set({ orders: data.data || data || [] });
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
  },
}));
