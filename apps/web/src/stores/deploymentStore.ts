import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface DeploymentEvent {
  id: string;
  state: string;
  message?: string;
  timestamp: string;
}

interface Deployment {
  id: string;
  version: string;
  environment: string;
  status: string;
  initiatorId: string;
  startedAt: string;
  completedAt?: string;
  events: DeploymentEvent[];
}

interface DeploymentStore {
  deployments: Deployment[];
  isLoading: boolean;
  error: string | null;
  fetchDeployments: () => Promise<void>;
  triggerDeployment: (version: string, environment: string) => Promise<void>;
  rollbackDeployment: (id: string) => Promise<void>;
}

export const useDeploymentStore = create<DeploymentStore>((set, get) => ({
  deployments: [],
  isLoading: false,
  error: null,
  fetchDeployments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await ApiClient.get<any>("/deployments");
      set({ deployments: res?.data || res || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  triggerDeployment: async (version: string, environment: string) => {
    try {
      await ApiClient.post<any>("/deployments", { version, environment, initiatorId: "admin" });
      await get().fetchDeployments();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  rollbackDeployment: async (id: string) => {
    try {
      await ApiClient.post<any>(`/deployments/${id}/rollback`, {});
      await get().fetchDeployments();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
