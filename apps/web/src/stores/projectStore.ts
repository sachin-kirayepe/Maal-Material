import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface ProjectState {
  projects: any[];
  stats: any;
  isLoading: boolean;
  error: string | null;
  fetchProjects: (params?: any) => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  stats: {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalWorkers: 0,
    totalEstimatedBudget: 0,
    totalActualCost: 0,
  },
  isLoading: false,
  error: null,
  fetchProjects: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/projects", { params });
      set({ projects: data.data?.data || data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchStats: async () => {
    try {
      const data = await ApiClient.get<any>("/projects/stats");
      set({ stats: data.data || data });
    } catch (error: any) {
      console.error("Failed to fetch project stats", error);
    }
  },
}));
