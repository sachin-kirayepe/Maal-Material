import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface FleetStat {
  id: string;
  totalAssets: number;
  activeRentals: number;
  inMaintenance: number;
  utilizationRate: number;
}

interface FleetState {
  stats: FleetStat[];
  isLoading: boolean;
  error: string | null;
  fetchStats: (tenantId: string) => Promise<void>;
}

export const useFleetStore = create<FleetState>((set) => ({
  stats: [],
  isLoading: false,
  error: null,
  fetchStats: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/fleet/analytics", { params: { tenantId } });
      set({
        isLoading: false,
        stats: data.data || data || [],
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
