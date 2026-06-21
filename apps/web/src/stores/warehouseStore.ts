import { create } from "zustand";
import { Warehouse, StockMovement } from "@constructos/types";
import { createSelectors } from "../utils/zustand";
import { ApiClient } from "@/lib/api-client";

interface WarehouseState {
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  dispatches: any[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  error: string | null;

  fetchWarehouses: () => Promise<void>;
  createWarehouse: (data: Partial<Warehouse>) => Promise<boolean>;

  // Stock operations
  stockIn: (data: {
    productId: string;
    warehouseId: string;
    quantity: number;
    notes?: string;
  }) => Promise<boolean>;
  stockOut: (data: {
    productId: string;
    warehouseId: string;
    quantity: number;
    notes?: string;
  }) => Promise<boolean>;
  transferStock: (data: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    notes?: string;
  }) => Promise<boolean>;
  fetchStockMovements: () => Promise<void>;
  
  // Dispatch operations
  fetchDispatches: (page?: number, limit?: number) => Promise<void>;
  markDispatchPacked: (id: string) => Promise<boolean>;
}

const useWarehouseStoreBase = create<WarehouseState>((set, get) => ({
  warehouses: [],
  stockMovements: [],
  dispatches: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchWarehouses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/warehouses");
      if (data.success || data.data || data) {
        set({ warehouses: data.data || data || [], isLoading: false });
      } else {
        set({ error: data.message || "Failed to fetch", isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createWarehouse: async (warehouseData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/warehouses", warehouseData);
      if (data.success || data.id || data.data) {
        await get().fetchWarehouses();
        return true;
      } else {
        set({ error: data.message || "Failed to create", isLoading: false });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  stockIn: async (stockData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/stock/in", {
        productId: stockData.productId,
        warehouseId: stockData.warehouseId,
        quantity: stockData.quantity,
        referenceType: "MANUAL",
        notes: stockData.notes || "Manual Stock In",
      });
      if (data.success || data.id || data.data) {
        set({ isLoading: false });
        get().fetchStockMovements();
        return true;
      } else {
        set({ error: data.message || "Failed", isLoading: false });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  stockOut: async (stockData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/stock/out", {
        productId: stockData.productId,
        warehouseId: stockData.warehouseId,
        quantity: stockData.quantity,
        referenceType: "MANUAL",
        notes: stockData.notes || "Manual Stock Out",
      });
      if (data.success || data.id || data.data) {
        set({ isLoading: false });
        get().fetchStockMovements();
        return true;
      } else {
        set({ error: data.message || "Failed", isLoading: false });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  transferStock: async (transferData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/stock/transfer", {
        productId: transferData.productId,
        fromWarehouseId: transferData.fromWarehouseId,
        toWarehouseId: transferData.toWarehouseId,
        quantity: transferData.quantity,
        notes: transferData.notes || "Manual Stock Transfer",
      });
      if (data.success || data.id || data.data) {
        set({ isLoading: false });
        get().fetchStockMovements();
        return true;
      } else {
        set({ error: data.message || "Failed", isLoading: false });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  fetchStockMovements: async () => {
    try {
      const data = await ApiClient.get<any>("/stock/movements", { params: { limit: 50 } });
      if (data.success || data.data || data) {
        set({ stockMovements: data.data?.items || data.data || data || [] });
      }
    } catch (err) {
      console.error("Failed to fetch stock movements", err);
    }
  },

  fetchDispatches: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/dispatch?page=${page}&limit=${limit}`);
      const data = response.data || response;
      set({ 
        dispatches: data.items || [], 
        meta: data.meta ? {
          total: data.meta.totalItems,
          page: data.meta.currentPage,
          limit: data.meta.itemsPerPage,
          totalPages: data.meta.totalPages
        } : null,
        isLoading: false 
      });
    } catch (error: any) {
      console.error("Failed to fetch dispatches:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  markDispatchPacked: async (id: string) => {
    set({ isLoading: true });
    try {
      await ApiClient.patch(`/dispatch/${id}/pack`, {});
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error("Failed to mark packed:", error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));

export const useWarehouseStore = createSelectors(useWarehouseStoreBase);
