import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface AnalyticsState {
  overview: any;
  trends: any[];
  isLoading: boolean;
  fetchOverview: (tenantId?: string) => Promise<void>;
  fetchTrends: (module: string, days?: number, tenantId?: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  overview: null,
  trends: [],
  isLoading: false,
  fetchOverview: async (tenantId) => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>("/analytics/overview", {
        params: tenantId ? { tenantId } : {}
      });
      set({ overview: data.data || data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  fetchTrends: async (module, days = 30, tenantId) => {
    set({ isLoading: true });
    try {
      const params: any = { module, days };
      if (tenantId) params.tenantId = tenantId;
      const data = await ApiClient.get<any>("/analytics/trends", { params });
      set({ trends: data.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
