import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface DisputeState {
  disputes: any[];
  isLoading: boolean;
  error: string | null;

  fetchDisputes: (tenantId?: string) => Promise<void>;
  createDispute: (data: any) => Promise<void>;
  updateCaseStatus: (tenantId: string, id: string, status: string, notes?: string) => Promise<void>;
}

export const useDisputeStore = create<DisputeState>((set) => ({
  disputes: [],
  isLoading: false,
  error: null,

  fetchDisputes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/disputes");
      set({ disputes: data?.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createDispute: async (disputeData) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/disputes", disputeData);
      await useDisputeStore.getState().fetchDisputes();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateCaseStatus: async (_tenantId, id, status, notes) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/disputes/${id}`, { status, notes });
      await useDisputeStore.getState().fetchDisputes();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
