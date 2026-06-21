import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface CommerceIntelligenceStore {
  analytics: any;
  fetchAnalytics: () => Promise<void>;
}

export const useCommerceIntelligenceStore = create<CommerceIntelligenceStore>((set) => ({
  analytics: null,
  fetchAnalytics: async () => {
    try {
      const data = await ApiClient.get<any>("/commerce-intelligence/analytics");
      set({ analytics: data?.data || data || null });
    } catch (e) {
      console.error("Failed to fetch analytics", e);
    }
  },
}));
