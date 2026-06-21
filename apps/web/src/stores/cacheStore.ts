import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface CacheEntry {
  id: string;
  cacheKey: string;
  cacheValue: string;
  ttlSeconds: number | null;
  invalidated: boolean;
  createdAt: string;
}

interface CacheStore {
  entries: CacheEntry[];
  fetchEntries: () => Promise<void>;
  invalidateKey: (key: string) => Promise<void>;
}

export const useCacheStore = create<CacheStore>((set, get) => ({
  entries: [],
  fetchEntries: async () => {
    try {
      const res = await ApiClient.get<any>("/cache/entries");
      set({ entries: res?.data || res || [] });
    } catch (error) {
      console.error("Failed to fetch cache entries:", error);
    }
  },
  invalidateKey: async (key: string) => {
    try {
      await ApiClient.post<any>(`/cache/invalidate/${encodeURIComponent(key)}`, {});
      await get().fetchEntries();
    } catch (error) {
      console.error("Failed to invalidate key:", error);
    }
  },
}));
