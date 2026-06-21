import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface LaborAttendance {
  id: string;
  workerName: string;
  trade: string;
  shift: string;
  hoursWorked: number;
  totalCalculatedWage: number;
}

interface LaborState {
  attendance: LaborAttendance[];
  isLoading: boolean;
  fetchAttendance: (projectId?: string) => Promise<void>;
}

export const useLaborStore = create<LaborState>((set) => ({
  attendance: [],
  isLoading: false,
  fetchAttendance: async (projectId) => {
    set({ isLoading: true });
    try {
      const params = projectId ? { projectId } : undefined;
      const data = await ApiClient.get<any>("/construction/labor/attendance", { params });
      set({ attendance: data.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
