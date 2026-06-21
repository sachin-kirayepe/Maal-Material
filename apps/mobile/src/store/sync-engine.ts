import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SyncAction = {
  id: string;
  type: "SCAN_INVENTORY" | "COMPLETE_WORK_ORDER" | "UPDATE_LOGISTICS";
  payload: any;
  timestamp: number;
  status: "PENDING" | "SYNCING" | "FAILED";
};

interface SyncState {
  isOnline: boolean;
  queue: SyncAction[];
  lastSync: number | null;
  setOnlineStatus: (status: boolean) => void;
  addAction: (action: Omit<SyncAction, "id" | "timestamp" | "status">) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      isOnline: true, // Will be updated by network listener
      queue: [],
      lastSync: null,

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        if (status) {
          get().processQueue(); // Automatically process queue when coming back online
        }
      },

      addAction: (action) => {
        const newAction: SyncAction = {
          ...action,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          status: "PENDING",
        };
        set((state) => ({ queue: [...state.queue, newAction] }));

        // If online, try to process immediately
        if (get().isOnline) {
          get().processQueue();
        }
      },

      processQueue: async () => {
        const { queue, isOnline } = get();
        if (!isOnline || queue.length === 0) return;

        // Mark all as syncing
        set((state) => ({
          queue: state.queue.map((a) => (a.status === "PENDING" ? { ...a, status: "SYNCING" } : a)),
        }));

        try {
          // Simulate network request syncing the queue
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // On success, clear the syncing ones
          set((state) => ({
            queue: state.queue.filter((a) => a.status !== "SYNCING"),
            lastSync: Date.now(),
          }));
        } catch (error) {
          // On fail, revert to pending or failed
          set((state) => ({
            queue: state.queue.map((a) =>
              a.status === "SYNCING" ? { ...a, status: "FAILED" } : a,
            ),
          }));
        }
      },

      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: "constructos-sync-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
