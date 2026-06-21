import { create } from "zustand";
import { Product, Category, Unit, InventoryDashboard } from "@constructos/types";
import { ApiClient } from "@/lib/api-client";

interface ProductsState {
  products: Product[];
  categories: Category[];
  units: Unit[];
  dashboard: InventoryDashboard | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<boolean>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  units: [],
  dashboard: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/products");
      if (data.success || data.data || data) {
        set({ products: data.data?.items || data.data || data || [], isLoading: false });
      } else {
        set({ error: data.message || "Failed to fetch", isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await ApiClient.get<any>("/categories");
      if (data.success || data.data || data) set({ categories: data.data || data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchUnits: async () => {
    try {
      const data = await ApiClient.get<any>("/units");
      if (data.success || data.data || data) set({ units: data.data || data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/products/dashboard");
      if (data.success || data.data || data) {
        set({ dashboard: data.data || data, isLoading: false });
      } else {
        set({ error: data.message || "Failed to fetch dashboard", isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/products", productData);
      if (data.success || data.id || data.data) {
        await get().fetchProducts();
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
}));
