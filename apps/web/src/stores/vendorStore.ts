import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Vendor {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  scores: any[];
}

interface VendorState {
  vendors: Vendor[];
  rfqs: any[];
  isLoading: boolean;
  fetchVendors: () => Promise<void>;
  fetchRfqs: () => Promise<void>;
}

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],
  rfqs: [],
  isLoading: false,
  fetchVendors: async () => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/vendors");
      set({ vendors: response?.data || response || [], isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
  fetchRfqs: async () => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/rfq-exchange/rfqs");
      set({ rfqs: response?.data || response || [], isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));
