import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface FinancialCommandState {
  purchaseStats: any | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useFinancialCommandStore = create<FinancialCommandState>((set) => ({
  purchaseStats: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const statsRes = await ApiClient.get<any>("/purchases/orders/stats");
      set({
        purchaseStats: statsRes?.data || statsRes || {
          totalOrders: 0,
          pendingApprovals: 0,
          totalSpend: 0,
        },
        isLoading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message, isLoading: false });
    }
  },
}));
