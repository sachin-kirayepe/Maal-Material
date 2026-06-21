import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import { CustomerDTO } from "@constructos/types";

interface CustomerState {
  customers: CustomerDTO[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: (search?: string) => Promise<void>;
  createCustomer: (data: Partial<CustomerDTO>) => Promise<boolean>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string | number | boolean> | undefined = search ? { search } : undefined;
      const data = await ApiClient.get<unknown>("/customers", { params });
      
      if (data?.success === false) {
        set({ error: data.message || "Error fetching customers", isLoading: false });
      } else {
        set({ customers: data?.data?.items || data?.data || data || [], isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch customers", isLoading: false });
    }
  },

  createCustomer: async (data: Partial<CustomerDTO>) => {
    try {
      const result = await ApiClient.post<unknown>("/customers", data);
      if (result?.success !== false) {
        const newCustomer = result?.data || result;
        set((state) => ({ customers: [newCustomer, ...state.customers] }));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },
}));
