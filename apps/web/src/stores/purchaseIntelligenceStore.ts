import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface PurchaseIntelligenceState {
  analytics: any;
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
}

export const usePurchaseIntelligenceStore = create<PurchaseIntelligenceState>((set) => ({
  analytics: null,
  isLoading: false,
  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>("/purchase-intelligence/analytics", { params: { tenantId: "tenant-1" } });
      set({ analytics: data?.data || data || null, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));
