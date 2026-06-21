import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface EnvConfig {
  id: string;
  environment: string;
  key: string;
  value: string;
  isSecret: boolean;
}

interface Pipeline {
  id: string;
  pipelineName: string;
  branch: string;
  status: string;
  durationMs: number;
  startedAt: string;
}

interface EnvironmentStore {
  configs: EnvConfig[];
  pipelines: Pipeline[];
  isLoading: boolean;
  error: string | null;
  fetchEnvironments: () => Promise<void>;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  configs: [],
  pipelines: [],
  isLoading: false,
  error: null,
  fetchEnvironments: async () => {
    set({ isLoading: true, error: null });
    try {
      const [configsRes, pipelinesRes] = await Promise.all([
        ApiClient.get<any>("/devops/environments"),
        ApiClient.get<any>("/devops/pipelines"),
      ]);
      set({
        configs: configsRes?.data || configsRes || [],
        pipelines: pipelinesRes?.data || pipelinesRes || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
