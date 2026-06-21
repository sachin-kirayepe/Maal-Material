import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface SiteOpsState {
  isLoading: boolean;
  error: string | null;
  submitDailyLog: (data: any) => Promise<void>;
}

export const useSiteOpsStore = create<SiteOpsState>((set) => ({
  isLoading: false,
  error: null,

  submitDailyLog: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.post("/construction/site-operations/activities", data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
