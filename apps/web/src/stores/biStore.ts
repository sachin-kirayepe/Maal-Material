import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface BIState {
  insights: any[];
  anomalies: any[];
  isLoading: boolean;
  fetchInsights: (tenantId?: string) => Promise<void>;
  fetchAnomalies: (tenantId?: string) => Promise<void>;
}

export const useBIStore = create<BIState>((set) => ({
  insights: [],
  anomalies: [],
  isLoading: false,
  fetchInsights: async (tenantId) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/business-intelligence/insights", { params: tenantId ? { tenantId } : {} });
      set({ insights: response.data || response || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  fetchAnomalies: async (tenantId) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/business-intelligence/anomalies", { params: tenantId ? { tenantId } : {} });
      set({ anomalies: response.data || response || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
