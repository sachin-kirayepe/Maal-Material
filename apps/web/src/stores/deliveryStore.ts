import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface DeliveryState {
  deliveries: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchDeliveries: (page?: number, limit?: number) => Promise<void>;
  scheduleDelivery: (data: any) => Promise<void>;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchDeliveries: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>(`/deliveries?page=${page}&limit=${limit}`);
      const data = response.data || response;
      set({ 
        deliveries: data.items || data.data || [], 
        meta: data.meta ? {
          total: data.meta.totalItems,
          page: data.meta.currentPage,
          limit: data.meta.itemsPerPage,
          totalPages: data.meta.totalPages
        } : null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  scheduleDelivery: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post("/deliveries", data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
