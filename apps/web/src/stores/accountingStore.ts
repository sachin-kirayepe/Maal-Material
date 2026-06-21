import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface AccountingState {
  chartOfAccounts: any[];
  ledgers: any[];
  journals: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  loading: boolean;
  fetchAccountingData: (page?: number, limit?: number) => Promise<void>;
  createJournalEntry: (data: any) => Promise<void>;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  chartOfAccounts: [],
  ledgers: [],
  journals: [],
  meta: null,
  loading: false,

  fetchAccountingData: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const [coasData, ledgersData, journalsData] = await Promise.all([
        ApiClient.get<any>("/accounting/chart-of-accounts"),
        ApiClient.get<any>("/accounting/ledgers"),
        ApiClient.get<any>(`/accounting/journals?page=${page}&limit=${limit}`),
      ]);
      set({
        chartOfAccounts: coasData.data || coasData || [],
        ledgers: ledgersData.data || ledgersData || [],
        journals: journalsData.data?.data || journalsData.data || journalsData || [],
        meta: journalsData.data?.meta || null,
      });
    } catch (error) {
      console.error("Failed to fetch accounting data", error);
    } finally {
      set({ loading: false });
    }
  },

  createJournalEntry: async (data: any) => {
    try {
      await ApiClient.post<any>("/accounting/journals", data);
      await get().fetchAccountingData();
    } catch (error) {
      console.error("Failed to create journal entry", error);
      throw error;
    }
  },
}));
