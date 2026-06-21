import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import type { Shop, ShopUser, ShopAnalytics } from "@constructos/types";

interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  shopUsers: ShopUser[];
  analytics: ShopAnalytics | null;
  isLoading: boolean;
  error: string | null;
  fetchShops: (tenantId: string, params?: any) => Promise<void>;
  fetchShopById: (id: string, tenantId: string) => Promise<void>;
  createShop: (tenantId: string, data: any) => Promise<void>;
  updateShop: (id: string, tenantId: string, data: any) => Promise<void>;
  deleteShop: (id: string, tenantId: string) => Promise<void>;
  updateSettings: (id: string, tenantId: string, data: any) => Promise<void>;
  fetchShopUsers: (shopId: string, tenantId: string) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops: [],
  currentShop: null,
  shopUsers: [],
  analytics: null,
  isLoading: false,
  error: null,

  fetchShops: async (tenantId: string, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/shops", { params, headers: { "x-tenant-id": tenantId } });
      set({ shops: data.data?.items || data.items || data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchShopById: async (id: string, tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/shops/${id}`, { headers: { "x-tenant-id": tenantId } });
      set({ currentShop: data.data || data, isLoading: false });

      // Fetch analytics
      const analyticsData = await ApiClient.get<any>(`/shops/${id}/analytics`, { headers: { "x-tenant-id": tenantId } });
      set({ analytics: analyticsData.data || analyticsData });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createShop: async (tenantId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/shops", data, { headers: { "x-tenant-id": tenantId } });
      await get().fetchShops(tenantId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateShop: async (id: string, tenantId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/shops/${id}`, data, { headers: { "x-tenant-id": tenantId } });
      await get().fetchShopById(id, tenantId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteShop: async (id: string, tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.delete<any>(`/shops/${id}`, { headers: { "x-tenant-id": tenantId } });
      await get().fetchShops(tenantId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateSettings: async (id: string, tenantId: string, data: any) => {
    try {
      await ApiClient.patch<any>(`/shops/${id}/settings`, data, { headers: { "x-tenant-id": tenantId } });
      await get().fetchShopById(id, tenantId);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchShopUsers: async (shopId: string, tenantId: string) => {
    try {
      const data = await ApiClient.get<any>(`/shop-users/shop/${shopId}`, { headers: { "x-tenant-id": tenantId } });
      set({ shopUsers: data.data || data || [] });
    } catch (error: any) {
      console.error("Failed to fetch shop users", error);
    }
  },
}));
