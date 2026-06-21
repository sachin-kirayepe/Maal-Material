import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface GatewayPolicy {
  id: string;
  routeMatch: string;
  forwardTo: string;
  rateLimitRate: number;
  rateLimitWindow: number;
  authRequired: boolean;
  isActive: boolean;
}

interface GatewayStore {
  policies: GatewayPolicy[];
  fetchPolicies: () => Promise<void>;
  togglePolicy: (id: string, isActive: boolean) => Promise<void>;
}

export const useGatewayStore = create<GatewayStore>((set, get) => ({
  policies: [],
  fetchPolicies: async () => {
    try {
      const res = await ApiClient.get<any>("/gateway/policies");
      set({ policies: res?.data || res || [] });
    } catch (error) {
      console.error("Failed to fetch gateway policies:", error);
    }
  },
  togglePolicy: async (id: string, isActive: boolean) => {
    try {
      await ApiClient.patch<any>(`/gateway/policies/${id}/toggle`, { isActive });
      await get().fetchPolicies();
    } catch (error) {
      console.error("Failed to toggle policy:", error);
    }
  },
}));
