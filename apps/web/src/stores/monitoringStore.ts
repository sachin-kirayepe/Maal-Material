import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Metric {
  id: string;
  nodeId: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface Node {
  id: string;
  name: string;
  role: string;
  region: string;
  status: string;
  ipAddress: string;
}

interface MonitoringStore {
  metrics: Metric[];
  nodes: Node[];
  isLoading: boolean;
  error: string | null;
  fetchMonitoring: () => Promise<void>;
}

export const useMonitoringStore = create<MonitoringStore>((set) => ({
  metrics: [],
  nodes: [],
  isLoading: false,
  error: null,
  fetchMonitoring: async () => {
    set({ isLoading: true, error: null });
    try {
      const [metricsRes, nodesRes] = await Promise.all([
        ApiClient.get<any>("/monitoring/metrics"),
        ApiClient.get<any>("/monitoring/nodes"),
      ]);
      set({ metrics: metricsRes?.data || metricsRes || [], nodes: nodesRes?.data || nodesRes || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
