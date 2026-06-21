import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface SiteActivity {
  id: string;
  activityDate: string;
  summary: string;
  progressDetails: string;
  status: string;
  reportedBy: string;
}

interface SiteOperationsState {
  activities: SiteActivity[];
  isLoading: boolean;
  fetchActivities: (projectId?: string) => Promise<void>;
}

export const useSiteOperationsStore = create<SiteOperationsState>((set) => ({
  activities: [],
  isLoading: false,
  fetchActivities: async (projectId) => {
    set({ isLoading: true });
    try {
      const params = projectId ? { projectId } : undefined;
      const data = await ApiClient.get<any>("/construction/site-operations/activities", { params });
      set({ activities: data.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
