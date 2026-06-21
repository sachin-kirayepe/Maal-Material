import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface FinanceState {
  profitability: any | null;
  cashFlow: any | null;
  loading: boolean;
  fetchFinanceIntelligence: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  profitability: null,
  cashFlow: null,
  loading: false,

  fetchFinanceIntelligence: async () => {
    set({ loading: true });
    try {
      const [prof, cash] = await Promise.all([
        ApiClient.get<any>("/finance/profitability"),
        ApiClient.get<any>("/finance/cash-flow"),
      ]);
      set({ profitability: prof?.data || prof || null, cashFlow: cash?.data || cash || null });
    } catch (error) {
      console.error("Failed to fetch finance intelligence", error);
    } finally {
      set({ loading: false });
    }
  },
}));
