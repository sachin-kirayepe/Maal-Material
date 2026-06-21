import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface SystemMetric {
  id: string;
  metricName: string;
  metricValue: number;
  unit: string;
  metadata?: any;
  recordedAt: string;
}

interface ObservabilityState {
  metrics: SystemMetric[];
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
}

export const useObservabilityStore = create<ObservabilityState>((set) => ({
  metrics: [],
  isLoading: false,
  error: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/observability/metrics");
      set({ metrics: response?.data || response || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
