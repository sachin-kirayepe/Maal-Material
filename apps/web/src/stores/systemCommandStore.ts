import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface SystemCommandState {
  rules: any[];
  telemetry: any | null;
  isLoading: boolean;
  error: string | null;
  fetchSystemStatus: () => Promise<void>;
  triggerSyncPush: (operations: any[]) => Promise<boolean>;
}

export const useSystemCommandStore = create<SystemCommandState>((set) => ({
  rules: [],
  telemetry: null,
  isLoading: false,
  error: null,

  fetchSystemStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const [rulesRes, telemetryRes] = await Promise.all([
        ApiClient.get<any>("/rules-engine"),
        ApiClient.get<any>("/civilization/infrastructure/telemetry").catch(() => null),
      ]);

      set({
        rules: rulesRes?.data || rulesRes || [],
        telemetry: telemetryRes?.data || telemetryRes || null,
        isLoading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message, isLoading: false });
    }
  },

  triggerSyncPush: async (operations: any[]) => {
    try {
      await ApiClient.post<any>("/offline-sync/push", {
        operations,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
}));
