import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import type { Tenant, TenantAnalytics } from "@constructos/types";

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  analytics: TenantAnalytics | null;
  platformAnalytics: any | null;
  isLoading: boolean;
  error: string | null;
  fetchTenants: (params?: any) => Promise<void>;
  fetchTenantById: (id: string) => Promise<void>;
  createTenant: (data: any) => Promise<void>;
  updateTenant: (id: string, data: any) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  fetchPlatformAnalytics: () => Promise<void>;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  currentTenant: null,
  analytics: null,
  platformAnalytics: null,
  isLoading: false,
  error: null,

  fetchTenants: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/tenants", { params });
      set({ tenants: data.data?.items || data.items || data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTenantById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/tenants/${id}`);
      set({ currentTenant: data.data || data, isLoading: false });

      // Also fetch analytics for this tenant
      const analyticsData = await ApiClient.get<any>(`/tenants/${id}/analytics`);
      set({ analytics: analyticsData.data || analyticsData });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTenant: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/tenants", data);
      await get().fetchTenants();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateTenant: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/tenants/${id}`, data);
      await get().fetchTenantById(id);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTenant: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.delete<any>(`/tenants/${id}`);
      await get().fetchTenants();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchPlatformAnalytics: async () => {
    try {
      const data = await ApiClient.get<any>("/tenants/analytics");
      set({ platformAnalytics: data.data || data });
    } catch (error: any) {
      console.error("Failed to fetch platform analytics", error);
    }
  },
}));
