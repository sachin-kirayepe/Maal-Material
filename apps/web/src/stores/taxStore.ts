import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface TaxState {
  rules: any[];
  records: any[];
  loading: boolean;
  fetchTaxData: () => Promise<void>;
}

export const useTaxStore = create<TaxState>((set) => ({
  rules: [],
  records: [],
  loading: false,

  fetchTaxData: async () => {
    set({ loading: true });
    try {
      const [rulesData, recordsData] = await Promise.all([
        ApiClient.get<any>("/tax/rules"),
        ApiClient.get<any>("/tax/records"),
      ]);
      set({ 
        rules: rulesData.data || rulesData || [], 
        records: recordsData.data || recordsData || [] 
      });
    } catch (error) {
      console.error("Failed to fetch tax data", error);
    } finally {
      set({ loading: false });
    }
  },
}));
