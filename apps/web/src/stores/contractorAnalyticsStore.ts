import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface ContractorAnalyticsState {
  contractors: any[];
  workflows: any[];
  isLoading: boolean;
  fetchContractors: (tenantId: string) => Promise<void>;
  fetchWorkflows: (tenantId: string) => Promise<void>;
}

export const useContractorAnalyticsStore = create<ContractorAnalyticsState>()(
  persist(
    (set) => ({
      contractors: [],
      workflows: [],
      isLoading: false,

      fetchContractors: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/operational-analytics/contractors", { params: { tenantId } });
          set({ contractors: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      fetchWorkflows: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/operational-analytics/workflows", { params: { tenantId } });
          set({ workflows: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },
    }),
    { name: "contractor-analytics-store" },
  ),
);
