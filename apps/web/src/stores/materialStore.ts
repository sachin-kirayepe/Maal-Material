import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface MaterialState {
  materials: any[];
  transfers: any[];
  isLoading: boolean;
  error: string | null;
  fetchMaterials: () => Promise<void>;
  fetchTransfers: () => Promise<void>;
  logConsumption: (data: unknown) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  transfers: [],
  isLoading: false,
  error: null,

  fetchMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<unknown>("/material-consumption/consumptions");
      const data = response?.data || response || [];
      set({ materials: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTransfers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<unknown>("/material-consumption/transfers");
      const data = response?.data || response || [];
      set({ transfers: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logConsumption: async (consumptionData) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<unknown>("/material-consumption/consume", consumptionData);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
