import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface RecommendationState {
  recommendations: any[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
  actionRecommendation: (id: string, status: string) => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>((set, _get) => ({
  recommendations: [],
  isLoading: false,
  error: null,

  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/recommendations");
      set({ recommendations: data?.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  actionRecommendation: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/recommendations/${id}/action`, { status });
      await _get().fetchRecommendations();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
