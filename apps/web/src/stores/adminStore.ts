import { create } from "zustand";
import { User, SystemRole } from "@constructos/types";
import { ApiClient } from "@/lib/api-client";

interface AdminState {
  users: User[];
  roles: SystemRole[];
  isLoading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  createUser: (data: Partial<User>) => Promise<void>;
  createRole: (data: Partial<SystemRole>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  roles: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/users");
      set({ users: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/roles");
      set({ roles: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/users", userData);
      await get().fetchUsers();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createRole: async (roleData) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post<any>("/roles", roleData);
      await get().fetchRoles();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
