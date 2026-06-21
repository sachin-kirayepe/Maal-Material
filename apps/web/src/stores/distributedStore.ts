import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface DistributedTask {
  id: string;
  taskType: string;
  payload: string;
  status: string;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
}

interface DistributedStore {
  tasks: DistributedTask[];
  fetchTasks: () => Promise<void>;
  retryTask: (id: string) => Promise<void>;
}

export const useDistributedStore = create<DistributedStore>((set, get) => ({
  tasks: [],
  fetchTasks: async () => {
    try {
      const res = await ApiClient.get<any>("/distributed/tasks");
      set({ tasks: res?.data || res || [] });
    } catch (error) {
      console.error("Failed to fetch distributed tasks:", error);
    }
  },
  retryTask: async (id: string) => {
    try {
      await ApiClient.post<any>(`/distributed/tasks/${id}/retry`, {});
      await get().fetchTasks();
    } catch (error) {
      console.error("Failed to retry task:", error);
    }
  },
}));
