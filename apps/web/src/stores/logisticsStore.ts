import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import { Dispatch, Driver, Vehicle } from "@constructos/types";

interface LogisticsState {
  dispatches: Dispatch[];
  drivers: Driver[];
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;

  fetchDispatches: () => Promise<void>;
  fetchDrivers: () => Promise<void>;
  fetchVehicles: () => Promise<void>;
}

export const useLogisticsStore = create<LogisticsState>((set) => ({
  dispatches: [],
  drivers: [],
  vehicles: [],
  isLoading: false,
  error: null,

  fetchDispatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/dispatch");
      set({ dispatches: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchDrivers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/drivers");
      set({ drivers: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/fleet/operations");
      set({ vehicles: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
