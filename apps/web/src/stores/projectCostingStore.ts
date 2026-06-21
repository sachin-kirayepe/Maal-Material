import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface CostingRecord {
  id: string;
  projectId: string;
  category: string;
  amount: number;
  recordedAt: string;
}

interface ProjectCostingState {
  records: CostingRecord[];
  isLoading: boolean;
  fetchRecords: (projectId: string) => Promise<void>;
  addCost: (projectId: string, category: string, amount: number) => Promise<void>;
}

export const useProjectCostingStore = create<ProjectCostingState>((set) => ({
  records: [],
  isLoading: false,
  fetchRecords: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const res = await ApiClient.get<any>(`/project-costing/${projectId}`);
      set({ records: res?.data || res || [], isLoading: false });
    } catch (err) {
      console.error("Costing fetch error:", err);
      set({ isLoading: false, records: [] });
    }
  },
  addCost: async (projectId: string, category: string, amount: number) => {
    try {
      await ApiClient.post<any>(`/project-costing/${projectId}`, { category, amount });
    } catch (err) {
      console.error("Add cost error:", err);
    }
  },
}));
