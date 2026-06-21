import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface AttendanceRecord {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  isLoading: boolean;
  fetchRecords: (projectId: string) => Promise<void>;
  checkInWorker: (workerId: string, projectId: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  isLoading: false,
  fetchRecords: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const data = await ApiClient.get<any>(`/attendance/projects/${projectId}`);
      set({ records: data.data || data || [], isLoading: false });
    } catch (err) {
      console.error("Attendance Error:", err);
      set({ isLoading: false, records: [] });
    }
  },
  checkInWorker: async (workerId: string, projectId: string) => {
    try {
      await ApiClient.post<any>(`/attendance/check-in`, { workerId, projectId });
    } catch (err) {
      console.error("Check-in Error:", err);
    }
  },
}));
