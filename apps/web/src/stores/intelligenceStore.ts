import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface IntelligenceState {
  summary: any | null;
  isLoading: boolean;
  error: string | null;
  fetchSummary: (tenantId: string) => Promise<void>;
}

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    (set) => ({
      summary: null,
      isLoading: false,
      error: null,
      fetchSummary: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
          const res = await ApiClient.get<any>("/intelligence/summary", { params: { tenantId } });
          set({ summary: res?.data || res || null, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
    }),
    { name: "intelligence-store" },
  ),
);
