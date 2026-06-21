import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface WorkflowsState {
  workflows: any[];
  isLoading: boolean;
  fetchWorkflows: (tenantId?: string) => Promise<void>;
}

export const useWorkflowsStore = create<WorkflowsState>((set) => ({
  workflows: [],
  isLoading: false,
  fetchWorkflows: async (tenantId) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/simplified-workflows", { params: tenantId ? { tenantId } : {} });
      set({ workflows: response.data || response || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
