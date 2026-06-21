import { create } from "zustand";
import { User, SystemRole, SystemPermission } from "@constructos/types";
import { ApiClient } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // State Setters
  setLoading: (loading: boolean) => void;
  clearSession: () => void;

  // API Integration Actions
  login: (email: string, password: string) => Promise<unknown>;
  registerUser: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<unknown>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  checkAuth: () => Promise<void>;

  // RBAC Queries
  hasRole: (role: SystemRole | string) => boolean;
  hasPermission: (permission: SystemPermission | string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),

  clearSession: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("constructos_user");
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.post<any>("/auth/login", { email, password });
      const data = response?.data || response;
      const { user } = data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("constructos_user", JSON.stringify(user));
      }

      return user;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  registerUser: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.post<any>("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      const data = response?.data || response;
      const { user } = data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("constructos_user", JSON.stringify(user));
      }

      return data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    // M-12 FIX: Always clear session, even if API logout fails
    try {
      await ApiClient.post<unknown>("/auth/logout", {});
    } catch (err: any) {
      console.error("Failed to revoke token on sign out", err);
    } finally {
      get().clearSession();
    }
  },

  refreshSession: async () => {
    try {
      // Backend reads token from cookies
      const response = await ApiClient.post<any>("/auth/refresh", {});
      const data = response?.data || response;

      if (!data || data.success === false) {
        get().clearSession();
        return false;
      }
      return true;
    } catch {
      get().clearSession();
      return false;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    try {
      const userStr = localStorage.getItem("constructos_user");

      if (userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Silently verify or refresh session with backend
        try {
          const response = await ApiClient.get<any>("/auth/me");
          const data = response?.data || response;
          if (data) {
            set({ user: data });
            localStorage.setItem("constructos_user", JSON.stringify(data));
          }
        } catch {
          // Access token might be expired, attempt to rotate refresh token
          const refreshed = await get().refreshSession();
          if (!refreshed) {
            get().clearSession();
          } else {
            // Re-fetch user after refresh
            try {
              const response = await ApiClient.get<any>("/auth/me");
              const data = response?.data || response;
              if (data) {
                set({ user: data, isAuthenticated: true });
                localStorage.setItem("constructos_user", JSON.stringify(data));
              }
            } catch {
              get().clearSession();
            }
          }
        }
      } else {
        set({ isLoading: false });
      }
    } catch {
      get().clearSession();
    }
  },

  hasRole: (role) => {
    const { user } = get();
    if (!user) return false;

    // Super Admin bypasses all checks
    if (user.role?.name === "SUPER_ADMIN" || user.roles?.some((r) => r.name === "SUPER_ADMIN")) {
      return true;
    }

    return user.role?.name === role || user.roles?.some((r) => r.name === role) || false;
  },

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;

    // Super Admin bypasses all checks
    if (user.role?.name === "SUPER_ADMIN" || user.roles?.some((r) => r.name === "SUPER_ADMIN")) {
      return true;
    }

    // Check primary role permissions
    const primaryPermissions = user.role?.permissions || [];
    if (primaryPermissions.some((p) => p.action === permission)) return true;

    // Check multi-role permissions array
    const allRolesPermissions = user.roles?.flatMap((r) => r.permissions || []) || [];
    return allRolesPermissions.some((p) => p.action === permission);
  },
}));

// Automatically load and verify authentication state on runtime load
if (typeof window !== "undefined") {
  useAuthStore.getState().checkAuth();
}
