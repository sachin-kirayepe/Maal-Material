import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface EcosystemStore {
  connections: any[];
  settlements: any[];
  fetchConnections: () => Promise<void>;
  fetchSettlements: () => Promise<void>;
}

export const useEcosystemStore = create<EcosystemStore>((set) => ({
  connections: [],
  settlements: [],
  fetchConnections: async () => {
    try {
      const data = await ApiClient.get<any>("/ecosystem/connections");
      set({ connections: data?.data || data || [] });
    } catch (e) {
      console.error("Failed to fetch connections", e);
    }
  },
  fetchSettlements: async () => {
    try {
      const data = await ApiClient.get<any>("/ecosystem/settlements");
      set({ settlements: data?.data || data || [] });
    } catch (e) {
      console.error("Failed to fetch settlements", e);
    }
  },
}));
