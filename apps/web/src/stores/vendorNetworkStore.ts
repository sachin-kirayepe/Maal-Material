import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface VendorNetworkStore {
  vendors: any[];
  fetchVendors: () => Promise<void>;
}

export const useVendorNetworkStore = create<VendorNetworkStore>((set) => ({
  vendors: [],
  fetchVendors: async () => {
    try {
      const data = await ApiClient.get<any>("/vendor-network/vendors");
      set({ vendors: data?.data || data || [] });
    } catch (e) {
      console.error("Failed to fetch vendors", e);
    }
  },
}));
