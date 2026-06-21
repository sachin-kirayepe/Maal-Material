import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface FieldTask {
  id: string;
  taskType: string;
  status: string;
  priority: string;
  payload: string;
  assignee?: { firstName?: string; lastName?: string; email: string };
  createdAt: string;
}

interface FieldStore {
  tasks: FieldTask[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
}

export const useFieldStore = create<FieldStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/field-operations/tasks");
      set({ tasks: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
