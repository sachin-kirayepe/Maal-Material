import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface RFQ {
  id: string;
  buyerId: string;
  title: string;
  requirements: string;
  status: string;
  bidsReceived: number;
}

interface RfqExchangeState {
  rfqs: RFQ[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  fetchRfqs: (tenantId: string, page?: number, limit?: number) => Promise<void>;
  updateRfqStatus: (id: string, status: string) => void;
  submitBid: (rfqId: string, amount: number, notes: string) => Promise<void>;
}

export const useRfqExchangeStore = create<RfqExchangeState>((set, get) => ({
  rfqs: [],
  meta: null,
  isLoading: false,
  fetchRfqs: async (tenantId: string, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/v1/rfq-exchange?tenantId=${tenantId}&page=${page}&limit=${limit}`);
      const data = response?.data || response;
      set({ 
        rfqs: data.data || data || [], 
        meta: data.meta || null,
        isLoading: false 
      });
    } catch (err) {
      console.error(err);
      set({ rfqs: [], isLoading: false });
    }
  },
  updateRfqStatus: (id: string, status: string) => {
    const rfqs = get().rfqs.map((r) => (r.id === id ? { ...r, status } : r));
    set({ rfqs });
  },
  submitBid: async (rfqId: string, amount: number, notes: string) => {
    try {
      await ApiClient.post<any>(`/v1/rfq-exchange/${rfqId}/bid`, { amount, notes });
      // After placing a bid, optimistically update or re-fetch
      // For now, let's just increment bidsReceived locally if we have it
    } catch (err) {
      console.error("Failed to submit bid:", err);
      throw err;
    }
  },
}));
