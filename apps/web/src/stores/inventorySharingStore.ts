import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Transfer {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  itemId: string;
  quantity: number;
  status: string;
}

interface InventorySharingState {
  transfers: Transfer[];
  isLoading: boolean;
  fetchTransfers: (tenantId: string) => Promise<void>;
  updateTransferStatus: (id: string, status: string, tenantId?: string) => Promise<void>;
}

export const useInventorySharingStore = create<InventorySharingState>((set, get) => ({
  transfers: [],
  isLoading: false,
  fetchTransfers: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/inventory/sharing", { params: { tenantId } });
      set({
        isLoading: false,
        transfers: response?.data || response || [],
      });
    } catch (error) {
      console.error("Failed to fetch transfers:", error);
      set({ isLoading: false });
    }
  },
  updateTransferStatus: async (id: string, status: string, tenantId?: string) => {
    // Optimistic update
    const previousTransfers = get().transfers;
    set({ transfers: previousTransfers.map((t) => (t.id === id ? { ...t, status } : t)) });

    try {
      await ApiClient.patch<any>(`/inventory/sharing/${id}/status`, { status, tenantId });
    } catch (error) {
      console.error("Failed to update transfer status:", error);
      // Revert optimistic update on failure
      set({ transfers: previousTransfers });
    }
  },
}));
