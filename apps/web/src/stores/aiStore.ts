import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface AiState {
  actionLogs: any[];
  context: any[];
  isLoading: boolean;
  error: string | null;
  fetchActionLogs: () => Promise<void>;
  fetchContext: () => Promise<void>;
  dispatchCommand: (command: string, payload: any) => Promise<void>;
}

export const useAiStore = create<AiState>((set, _get) => ({
  actionLogs: [],
  context: [],
  isLoading: false,
  error: null,

  fetchActionLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/ai/action-logs");
      set({ actionLogs: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchContext: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/ai/context");
      set({ context: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  dispatchCommand: async (command: string, payload: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/ai/command", { command, payload });
      await _get().fetchActionLogs();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
