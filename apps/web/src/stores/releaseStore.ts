import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Release {
  id: string;
  version: string;
  notes: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

interface ReleaseStore {
  releases: Release[];
  isLoading: boolean;
  error: string | null;
  fetchReleases: () => Promise<void>;
  publishRelease: (id: string) => Promise<void>;
}

export const useReleaseStore = create<ReleaseStore>((set, get) => ({
  releases: [],
  isLoading: false,
  error: null,
  fetchReleases: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await ApiClient.get<any>("/releases");
      set({ releases: res?.data || res || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  publishRelease: async (id: string) => {
    try {
      await ApiClient.post<any>(`/releases/${id}/publish`, {});
      await get().fetchReleases();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
