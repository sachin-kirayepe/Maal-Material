import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface RecommendationsState {
  recommendations: any[];
  isLoading: boolean;
  fetchRecommendations: (tenantId: string, module?: string) => Promise<void>;
  actionRecommendation: (
    tenantId: string,
    recId: string,
    action: string,
    userId: string,
  ) => Promise<void>;
}

export const useRecommendationsStore = create<RecommendationsState>()(
  persist(
    (set, get) => ({
      recommendations: [],
      isLoading: false,

      fetchRecommendations: async (tenantId, module) => {
        set({ isLoading: true });
        try {
          const params: any = { tenantId };
          if (module) params.module = module;
          
          const res = await ApiClient.get<any>("/recommendations", { params });
          set({ recommendations: res?.data || res || [], isLoading: false });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      actionRecommendation: async (tenantId, recId, action, userId) => {
        try {
          await ApiClient.post<any>("/recommendations/action", {
            tenantId,
            recommendationId: recId,
            actionTaken: action,
            userId,
          });
          // Remove from local list upon action
          set({ recommendations: get().recommendations.filter((r) => r.id !== recId) });
        } catch (err) {
          console.error(err);
        }
      },
    }),
    { name: "recommendations-store" },
  ),
);
