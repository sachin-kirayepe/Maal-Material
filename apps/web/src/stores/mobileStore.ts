import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface MobileSession {
  id: string;
  deviceId: string;
  userId: string;
  status: string;
  lastActiveAt: string;
  user: { firstName?: string; lastName?: string; email: string };
  device: { name: string; os: string };
}

interface MobileStore {
  sessions: MobileSession[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
}

export const useMobileStore = create<MobileStore>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,
  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/field-operations/sessions");
      set({ sessions: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
