import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface ComplianceRecord {
  id: string;
  reportType: string;
  summary: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

interface ComplianceState {
  records: ComplianceRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  generateReport: (reportType: string) => Promise<void>;
}

export const useComplianceStore = create<ComplianceState>((set) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/compliance/records");
      set({ records: response?.data || response || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  generateReport: async (reportType: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/compliance/generate", { reportType });
      // Fetch again to get the new record
      const response = await ApiClient.get<any>("/compliance/records");
      set({ records: response?.data || response || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
