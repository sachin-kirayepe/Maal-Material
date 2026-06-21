import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Rule {
  id?: string;
  name: string;
  description: string;
  module: string;
  eventTrigger: string;
  conditions: any;
  actions: any;
  isActive: boolean;
}

interface RulesState {
  rules: Rule[];
  executions: any[];
  isLoading: boolean;
  fetchRules: () => Promise<void>;
  createRule: (rule: Rule) => Promise<void>;
  fetchExecutions: () => Promise<void>;
}

export const useRulesStore = create<RulesState>((set) => ({
  rules: [],
  executions: [],
  isLoading: false,
  fetchRules: async () => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>("/rules-engine");
      set({ rules: data?.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  createRule: async (rule) => {
    set({ isLoading: true });
    try {
      await ApiClient.post<any>("/rules-engine", rule);
      set((state) => ({ rules: [rule, ...state.rules], isLoading: false }));
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  fetchExecutions: async () => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>("/rules-engine/executions");
      set({ executions: data?.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
