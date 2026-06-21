import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface ShippingState {
  zones: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  error: string | null;

  fetchZones: (page?: number, limit?: number) => Promise<void>;
}

export const useShippingStore = create<ShippingState>((set) => ({
  zones: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchZones: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>(`/shipping?page=${page}&limit=${limit}`);
      const data = response.data || response;
      set({ 
        zones: data.data || data || [], 
        meta: data.meta ? {
          total: data.meta.total,
          page: data.meta.page,
          limit: data.meta.limit,
          totalPages: data.meta.totalPages
        } : null,
        isLoading: false 
      });
    } catch (error: any) {
      console.error("Failed to fetch shipping zones:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
