import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Permission {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: Permission[];
}

interface RBACState {
  roles: Role[];
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;

  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  assignPermission: (roleName: string, action: string) => Promise<void>;
  removePermission: (roleName: string, action: string) => Promise<void>;
}

export const useRBACStore = create<RBACState>((set, get) => ({
  roles: [],
  permissions: [],
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/roles");
      const data = response?.data || response;
      set({ roles: data || [], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch roles:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/permissions");
      const data = response?.data || response;
      set({ permissions: data || [], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch permissions:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  assignPermission: async (roleName: string, action: string) => {
    try {
      await ApiClient.post(`/roles/${roleName}/permissions`, { permissionAction: action });
      await get().fetchRoles(); // Refresh to get updated role permissions
    } catch (error: any) {
      console.error("Failed to assign permission:", error);
    }
  },

  removePermission: async (roleName: string, action: string) => {
    try {
      await ApiClient.delete(`/roles/${roleName}/permissions/${action}`);
      await get().fetchRoles(); // Refresh to get updated role permissions
    } catch (error: any) {
      console.error("Failed to remove permission:", error);
    }
  },
}));
