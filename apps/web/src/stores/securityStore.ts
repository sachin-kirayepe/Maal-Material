import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
}

interface SecurityState {
  events: SecurityEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  blockIp: (ipAddress: string) => Promise<void>;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/security/events");
      set({ events: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  blockIp: async (ipAddress: string) => {
    try {
      await ApiClient.post<any>("/security/block-ip", { ipAddress });
    } catch (err: any) {
      console.error("Failed to block IP:", err);
    }
  },
}));
