import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface SourcingState {
  rfqs: any[];
  quotations: any[];
  isLoading: boolean;
  fetchSourcingData: () => Promise<void>;
}

export const useSourcingStore = create<SourcingState>((set) => ({
  rfqs: [],
  quotations: [],
  isLoading: false,
  fetchSourcingData: async () => {
    set({ isLoading: true });
    try {
      const [rfqs, quotations] = await Promise.all([
        ApiClient.get<any>("/sourcing/rfqs", { params: { tenantId: "tenant-1" } }),
        ApiClient.get<any>("/sourcing/quotations", { params: { tenantId: "tenant-1" } }),
      ]);
      set({ rfqs: rfqs?.data || rfqs || [], quotations: quotations?.data || quotations || [], isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));
