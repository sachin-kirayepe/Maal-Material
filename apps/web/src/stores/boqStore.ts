import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface BOQState {
  items: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  error: string | null;

  fetchItems: (projectId?: string, page?: number, limit?: number) => Promise<void>;
}

export const useBOQStore = create<BOQState>((set) => ({
  items: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchItems: async (projectId = "", page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (projectId) queryParams.append("projectId", projectId);

      const response = await ApiClient.get<any>(`/construction/boq?${queryParams.toString()}`);
      const data = response.data || response;
      set({ 
        items: data.data || data || [], 
        meta: data.meta || null,
        isLoading: false 
      });
    } catch (error: any) {
      console.error("Failed to fetch BOQ items:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
