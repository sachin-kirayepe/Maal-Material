import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface ReconciliationState {
  records: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  loading: boolean;
  fetchReconciliations: (page?: number, limit?: number) => Promise<void>;
}

export const useReconciliationStore = create<ReconciliationState>((set) => ({
  records: [],
  meta: null,
  loading: false,

  fetchReconciliations: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const response = await ApiClient.get<any>(`/settlements?page=${page}&limit=${limit}`);
      set({ 
        records: response.data?.data || response.data || [],
        meta: response.data?.meta || null
      });
    } catch (error) {
      console.error("Failed to fetch reconciliations", error);
    } finally {
      set({ loading: false });
    }
  },
}));
