import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface RiskAnalysisState {
  customerRisks: any[];
  vendorIntelligence: any[];
  isLoading: boolean;
  fetchCustomerRisks: (tenantId: string) => Promise<void>;
  fetchVendorIntelligence: (tenantId: string) => Promise<void>;
}

export const useRiskAnalysisStore = create<RiskAnalysisState>()(
  persist(
    (set) => ({
      customerRisks: [],
      vendorIntelligence: [],
      isLoading: false,

      fetchCustomerRisks: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/risk-analysis/customer", { params: { tenantId } });
          set({ customerRisks: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      fetchVendorIntelligence: async (tenantId) => {
        set({ isLoading: true });
        try {
          const res = await ApiClient.get<any>("/risk-analysis/vendor", { params: { tenantId } });
          set({ vendorIntelligence: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },
    }),
    { name: "risk-analysis-store" },
  ),
);
