import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Requisition {
  id: string;
  prNumber: string;
  department: string;
  status: string;
  estimatedCost: number;
  priority: string;
  createdAt: string;
}

interface ProcurementState {
  suppliers: any[];
  fetchSuppliers: () => void;
  createPurchaseOrder: (data: any) => void;
  requisitions: Requisition[];
  isLoading: boolean;
  fetchRequisitions: () => Promise<void>;
  purchaseOrders: any[];
  supplierStats: any;
  purchaseStats: any;
  fetchPurchaseOrders: () => Promise<void>;
  fetchSupplierStats: () => Promise<void>;
  fetchPurchaseStats: () => Promise<void>;
  approvePurchaseOrder: (id: string) => Promise<void>;
}

export const useProcurementStore = create<ProcurementState>((set) => ({
  suppliers: [],
  fetchSuppliers: async () => {
    try {
      const data = await ApiClient.get<any>("/procurement/suppliers");
      set({ suppliers: data.data || data || [] });
    } catch (e) {
      console.error(e);
    }
  },
  createPurchaseOrder: async (payload: any) => {
    try {
      await ApiClient.post("/purchases/orders", payload);
      // Re-fetch after creation
      get().fetchPurchaseOrders();
      get().fetchPurchaseStats();
    } catch (e) {
      console.error("Failed to create purchase order:", e);
      throw e;
    }
  },
  requisitions: [],
  isLoading: false,
  fetchRequisitions: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>("/procurement/requisitions", { params: { tenantId } });
      set({ requisitions: data.data || data || [], isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
  purchaseOrders: [],
  supplierStats: {},
  purchaseStats: {},
  fetchPurchaseOrders: async () => {
    try {
      const data = await ApiClient.get<any>("/procurement/purchase-orders");
      set({ purchaseOrders: data.data || data || [] });
    } catch (e) {
      console.error(e);
    }
  },
  fetchSupplierStats: async () => {
    try {
      const data = await ApiClient.get<any>("/procurement/suppliers/stats");
      set({ supplierStats: data.data || data || {} });
    } catch (e) {
      console.error(e);
    }
  },
  fetchPurchaseStats: async () => {
    try {
      const data = await ApiClient.get<any>("/procurement/purchase-orders/stats");
      set({ purchaseStats: data.data || data || {} });
    } catch (e) {
      console.error(e);
    }
  },
  approvePurchaseOrder: async (id: string) => {
    try {
      await ApiClient.post<any>(`/procurement/purchase-orders/${id}/approve`, {});
      // Refresh after approval
      const data = await ApiClient.get<any>("/procurement/purchase-orders");
      set({ purchaseOrders: data.data || data || [] });
    } catch (e) {
      console.error(e);
    }
  }
}));
