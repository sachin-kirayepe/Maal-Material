import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface PredictionsState {
  inventoryPredictions: any[];
  procurementPredictions: any[];
  forecasts: any[];
  isLoading: boolean;
  fetchInventoryPredictions: (tenantId: string) => Promise<void>;
  fetchProcurementPredictions: (tenantId: string) => Promise<void>;
  fetchForecasts: (tenantId: string) => Promise<void>;
}

export const usePredictionsStore = create<PredictionsState>()(
  persist(
    (set) => ({
      inventoryPredictions: [],
      procurementPredictions: [],
      forecasts: [],
      isLoading: false,

      fetchInventoryPredictions: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/predictions/inventory", { params: { tenantId } });
          set({ inventoryPredictions: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      fetchProcurementPredictions: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/predictions/procurement", { params: { tenantId } });
          set({ procurementPredictions: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      fetchForecasts: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/predictions/forecasts", { params: { tenantId } });
          set({ forecasts: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },
    }),
    { name: "predictions-store" },
  ),
);
