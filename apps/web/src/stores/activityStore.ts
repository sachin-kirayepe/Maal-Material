import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string;
  createdAt: string;
  actor?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ActivityState {
  activities: Activity[];
  fetchActivities: () => Promise<void>;
  addActivity: (activity: Activity) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],

  fetchActivities: async () => {
    try {
      const res = await ApiClient.get<any>("/activity");
      set({ activities: res?.data || res || [] });
    } catch (err) {
      console.error("Failed to fetch activities", err);
    }
  },

  addActivity: (activity: Activity) => {
    set((state) => ({
      activities: [activity, ...state.activities],
    }));
  },
}));
