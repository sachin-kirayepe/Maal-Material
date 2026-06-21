import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface ApprovalState {
  pendingPurchaseOrders: any[];
  isLoading: boolean;
  error: string | null;
  fetchPendingApprovals: () => Promise<void>;
  approvePurchaseOrder: (id: string) => Promise<boolean>;
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  pendingPurchaseOrders: [],
  isLoading: false,
  error: null,

  fetchPendingApprovals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Assuming 'PENDING' status filter for purchase orders
      const response = await ApiClient.get<any>("/purchases/orders", { params: { status: "PENDING" } });
      const data = response?.data || response || [];
      set({ pendingPurchaseOrders: data, isLoading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message, isLoading: false });
    }
  },

  approvePurchaseOrder: async (id: string) => {
    try {
      const response = await ApiClient.patch<any>(`/purchases/orders/${id}/approve`, {});
      const data = response?.data || response;
      if (data?.success) {
        // Remove from pending list
        set((state) => ({
          pendingPurchaseOrders: state.pendingPurchaseOrders.filter((po: any) => po.id !== id),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
}));
