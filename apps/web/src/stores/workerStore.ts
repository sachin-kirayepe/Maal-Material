import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface Worker {
  id: string;
  name: string;
  mobile: string;
  skillType: string;
  dailyWage: number;
  projectId?: string;
  contractorName?: string;
  isActive: boolean;
  project?: { name: string; projectCode: string };
  _count?: { attendances: number };
}

interface WorkerState {
  workers: Worker[];
  currentWorker: Worker | null;
  skillBreakdown: any[];
  isLoading: boolean;
  error: string | null;
  meta: any;

  fetchWorkers: (query?: any) => Promise<void>;
  fetchWorkerById: (id: string) => Promise<void>;
  fetchSkillBreakdown: () => Promise<void>;
  createWorker: (dto: any) => Promise<Worker>;
  setCurrentWorker: (worker: Worker | null) => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  workers: [],
  currentWorker: null,
  skillBreakdown: [],
  isLoading: false,
  error: null,
  meta: null,

  fetchWorkers: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params: any = {};
      if (query.projectId) params.projectId = query.projectId;
      if (query.skillType) params.skillType = query.skillType;
      if (query.search) params.search = query.search;
      if (query.page) params.page = query.page.toString();

      const data = await ApiClient.get<any>("/workers", { params });
      set({ workers: data.data || data || [], meta: data.meta, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWorkerById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/workers/${id}`);
      set({ currentWorker: data.data || data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSkillBreakdown: async () => {
    try {
      const data = await ApiClient.get<any>("/workers/skills");
      set({ skillBreakdown: data.data || data || [] });
    } catch (error: any) {
      console.error(error);
    }
  },

  createWorker: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/workers", dto);
      const newWorker = data.data || data;
      set((state) => ({ workers: [newWorker, ...state.workers], isLoading: false }));
      return newWorker;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setCurrentWorker: (worker) => set({ currentWorker: worker }),
}));
