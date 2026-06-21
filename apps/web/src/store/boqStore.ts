import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface BOQItem {
  id: string;
  itemCode: string;
  description: string;
  unit: string;
  estimatedQty: number;
  actualQty: number;
  totalEstimatedValue: number;
  totalActualValue: number;
}

interface BoqState {
  items: BOQItem[];
  isLoading: boolean;
  fetchItems: (projectId?: string) => Promise<void>;
}

export const useBoqStore = create<BoqState>((set) => ({
  items: [],
  isLoading: false,
  fetchItems: async (projectId) => {
    set({ isLoading: true });
    try {
      const params = projectId ? { projectId } : undefined;
      const data = await ApiClient.get<any>("/construction/boq", { params });
      set({ items: data.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
