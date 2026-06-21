import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Insight {
  id: string;
  region: string;
  productCategory: string;
  demandScore: number;
  supplyScore: number;
  trend: string;
}

interface VendorDiscoveryState {
  insights: Insight[];
  isLoading: boolean;
  fetchInsights: (tenantId: string) => Promise<void>;
}

export const useVendorDiscoveryStore = create<VendorDiscoveryState>((set) => ({
  insights: [],
  isLoading: false,
  fetchInsights: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/vendors/discovery", { params: { tenantId } });
      set({
        isLoading: false,
        insights: response?.data || response || [],
      });
    } catch (error) {
      console.error("Failed to fetch vendor insights:", error);
      set({ isLoading: false });
    }
  },
}));
