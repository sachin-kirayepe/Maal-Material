import { create } from "zustand";
import { ApiClient } from "../lib/api-client";

interface LedgerState {
  customerLedger: any | null;
  settlements: any[];
  entries: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  fetchCustomerLedger: (customerId: string) => Promise<void>;
  fetchCustomerSettlements: (customerId: string) => Promise<void>;
  fetchLedgerEntries: (page?: number, limit?: number) => Promise<void>;
  processSettlement: (data: any) => Promise<void>;
  createEntry: (data: any) => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set) => ({
  customerLedger: null,
  settlements: [],
  entries: [],
  meta: null,
  isLoading: false,

  fetchCustomerLedger: async (customerId) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/ledger/customer/${customerId}`);
      // Assuming response shape is standardized
      set({ customerLedger: response.data || response, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch ledger:", error);
      set({ isLoading: false });
    }
  },

  fetchCustomerSettlements: async (customerId) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/settlements/customer/${customerId}`);
      set({ settlements: response.data || response || [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch settlements:", error);
      set({ isLoading: false });
    }
  },

  fetchLedgerEntries: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/ledger/entries?page=${page}&limit=${limit}`);
      set({ 
        entries: response.data?.data || response.data || [], 
        meta: response.data?.meta || null,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      set({ isLoading: false });
    }
  },

  processSettlement: async (data) => {
    set({ isLoading: true });
    try {
      await ApiClient.post("/settlements", data);
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to process settlement:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createEntry: async (data) => {
    set({ isLoading: true });
    try {
      await ApiClient.post("/ledger/entries", data);
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to create ledger entry:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
