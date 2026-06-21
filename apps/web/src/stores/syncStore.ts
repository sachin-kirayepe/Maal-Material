import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

export interface QueuedOperation {
  operationId: string;
  entityType: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  payload: any;
  timestamp: number;
}

interface SyncState {
  queues: any[];
  conflicts: any[];
  error: string | null;
  fetchQueues: () => void;
  fetchConflicts: () => void;
  resolveConflict: (id: string, resolution: any) => void;
  isOnline: boolean;
  queue: QueuedOperation[];
  syncStatus: "IDLE" | "SYNCING" | "ERROR";
  lastSyncAt: string | null;

  setOnlineStatus: (status: boolean) => void;
  enqueueOperation: (op: Omit<QueuedOperation, "operationId" | "timestamp">) => void;
  processQueue: (tenantId: string, deviceId: string) => Promise<void>;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      queue: [],
      queues: [],
      conflicts: [],
      error: null,
      fetchQueues: () => {},
      fetchConflicts: () => {},
      resolveConflict: () => {},
      syncStatus: "IDLE",
      lastSyncAt: null,

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        if (status) {
          // Trigger sync automatically when coming online
          const queue = get().queue;
          if (queue.length > 0) {
            // Ideally inject tenantId and deviceId from auth context
            console.log("Network restored. Need to process queue...");
          }
        }
      },

      enqueueOperation: (op) => {
        const operationId = `op_${Date.now()}_${crypto.randomUUID()}`;
        set((state) => ({
          queue: [...state.queue, { ...op, operationId, timestamp: Date.now() }],
        }));
      },

      processQueue: async (tenantId: string, deviceId: string) => {
        const { queue, isOnline } = get();

        if (!isOnline || queue.length === 0) return;

        set({ syncStatus: "SYNCING" });

        try {
          const response = await ApiClient.post<any>("/offline-sync/push", {
            tenantId,
            deviceId,
            operations: queue,
          });

          const data = response.data || response;
          if (data?.status === "success") {
            set({
              queue: [],
              queues: [],
              conflicts: [],
              error: null,
              fetchQueues: () => {},
              fetchConflicts: () => {},
              resolveConflict: () => {}, // For enterprise safety, only remove ops that succeeded or failed fatally. For this UX, clear all.
              syncStatus: "IDLE",
              lastSyncAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Sync failed:", error);
          set({ syncStatus: "ERROR" });
        }
      },

      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: "constructos-sync-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Listen to browser network events
if (typeof window !== "undefined") {
  window.addEventListener("online", () => useSyncStore.getState().setOnlineStatus(true));
  window.addEventListener("offline", () => useSyncStore.getState().setOnlineStatus(false));
}
