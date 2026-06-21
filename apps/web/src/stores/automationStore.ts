import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface AutomationState {
  workflows: any[];
  isLoading: boolean;
  error: string | null;
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (data: any) => Promise<void>;
  toggleWorkflow: (id: string, isActive: boolean) => Promise<void>;
  triggerWorkflow: (id: string, payload: any) => Promise<void>;
}

export const useAutomationStore = create<AutomationState>((set, _get) => ({
  workflows: [],
  isLoading: false,
  error: null,

  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/automation/workflows");
      set({ workflows: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createWorkflow: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/automation/workflows", data);
      await _get().fetchWorkflows();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleWorkflow: async (id: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/automation/workflows/${id}/toggle`, { isActive });
      await _get().fetchWorkflows();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  triggerWorkflow: async (id: string, payload: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>(`/automation/workflows/${id}/trigger`, payload);
      await _get().fetchWorkflows();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
