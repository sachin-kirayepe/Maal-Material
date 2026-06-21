import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface AuditTrail {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  oldData?: any;
  newData?: any;
  createdAt: string;
}

interface AuditState {
  logs: AuditTrail[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/audit/trails");
      set({ logs: data.data || data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
