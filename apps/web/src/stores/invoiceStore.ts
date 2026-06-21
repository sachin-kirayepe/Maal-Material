import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import { InvoiceDTO } from "@constructos/types";

interface InvoiceState {
  invoices: InvoiceDTO[];
  isLoading: boolean;
  error: string | null;
  fetchInvoices: (status?: string) => Promise<void>;
  createInvoice: (data: unknown) => Promise<boolean>;
  recordPayment: (data: unknown) => Promise<boolean>;
  settlements: any[];
  fetchSettlements: (customerId: string) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  settlements: [],
  isLoading: false,
  error: null,

  fetchInvoices: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string | number | boolean> | undefined = status ? { status } : undefined;
      const data = await ApiClient.get<unknown>("/invoices", { params });
      
      // Handle the case where backend wraps it in { success: true, data: { items: [] } } 
      // or directly returns the array
      const items = data?.data?.items || data?.data || data || [];
      if (data?.success === false) {
         set({ error: data.message || "Error", isLoading: false });
      } else {
         set({ invoices: items, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch invoices", isLoading: false });
    }
  },

  createInvoice: async (data: unknown) => {
    try {
      const result = await ApiClient.post<unknown>("/invoices", data);
      const newInvoice = result?.data?.data || result?.data || result;
      if (result?.success !== false) {
        set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },

  recordPayment: async (data: unknown) => {
    try {
      const result = await ApiClient.post<unknown>("/payments", data);
      return result?.success !== false;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },

  fetchSettlements: async (customerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<unknown>(`/settlements/customer/${customerId}`);
      const items = data?.data || data || [];
      if (data?.success === false) {
        set({ error: data.message || "Error", isLoading: false });
      } else {
        set({ settlements: items, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch settlements", isLoading: false });
    }
  },
}));
