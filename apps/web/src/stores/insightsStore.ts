import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface InsightsState {
  aiInsights: any[];
  operationalAlerts: any[];
  isLoading: boolean;
  error: string | null;
  fetchAiInsights: () => Promise<void>;
  markInsightRead: (id: string) => Promise<void>;
  fetchOperationalAlerts: () => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
}

export const useInsightsStore = create<InsightsState>((set, _get) => ({
  aiInsights: [],
  operationalAlerts: [],
  isLoading: false,
  error: null,

  fetchAiInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/insights/ai-insights");
      set({ aiInsights: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  markInsightRead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/insights/ai-insights/${id}/read`, {});
      await _get().fetchAiInsights();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOperationalAlerts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/insights/alerts");
      set({ operationalAlerts: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  resolveAlert: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/insights/alerts/${id}/resolve`, {});
      await _get().fetchOperationalAlerts();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
