import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface EcommerceState {
  products: any[];
  categories: any[];
  cart: any | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  placeOrder: (paymentMethod: string, address: string) => Promise<any>;
}

export const useEcommerceStore = create<EcommerceState>((set, get) => ({
  products: [],
  categories: [],
  cart: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/products");
      set({ products: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/categories");
      set({ categories: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/cart");
      set({ cart: data.data || data, isLoading: false });
    } catch (err: any) {
      if (err.message?.includes("404") || err?.status === 404 || err.response?.status === 404) {
        set({ cart: { items: [], total: 0 }, isLoading: false });
      } else {
        set({ error: err.message, isLoading: false });
      }
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/cart/items", { productId, quantity });
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  placeOrder: async (paymentMethod, address) => {
    set({ isLoading: true, error: null });
    try {
      // Typically we'd pass cart ID or it's inferred from session
      const response = await ApiClient.post<any>("/orders", { 
        paymentMethod, 
        shippingAddress: address 
      });
      // Clear cart on success
      set({ cart: { items: [], total: 0 }, isLoading: false });
      return response.data || response;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
