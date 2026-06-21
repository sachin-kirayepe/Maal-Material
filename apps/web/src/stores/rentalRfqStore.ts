import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface RentalRFQ {
  id: string;
  contractorId: string;
  equipmentType: string;
  quantity: number;
  location: string;
  status: string;
}

interface RentalRfqState {
  rfqs: RentalRFQ[];
  isLoading: boolean;
  fetchRfqs: (tenantId: string) => Promise<void>;
}

export const useRentalRfqStore = create<RentalRfqState>((set) => ({
  rfqs: [],
  isLoading: false,
  fetchRfqs: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/rentals/rfq", { params: { tenantId } });
      set({
        isLoading: false,
        rfqs: response?.data || response || [],
      });
    } catch (error) {
      console.error("Failed to fetch RFQs:", error);
      set({ isLoading: false });
    }
  },
}));
