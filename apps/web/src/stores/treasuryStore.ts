import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface TreasuryState {
  bankAccounts: any[];
  treasuryBalance: any | null;
  loading: boolean;
  fetchTreasuryData: () => Promise<void>;
}

export const useTreasuryStore = create<TreasuryState>((set) => ({
  bankAccounts: [],
  treasuryBalance: null,
  loading: false,

  fetchTreasuryData: async () => {
    set({ loading: true });
    try {
      const [accounts, balance] = await Promise.all([
        ApiClient.get<any>("/treasury/bank-accounts"),
        ApiClient.get<any>("/treasury/balance"),
      ]);
      set({ bankAccounts: accounts?.data || accounts || [], treasuryBalance: balance?.data || balance || null });
    } catch (error) {
      console.error("Failed to fetch treasury data", error);
    } finally {
      set({ loading: false });
    }
  },
}));
