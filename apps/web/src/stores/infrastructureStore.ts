import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface InfrastructureNode {
  id: string;
  region: string;
  nodeId: string;
  nodeType: string;
  status: string;
  cpuUsage: number | null;
  memoryUsage: number | null;
  lastHeartbeat: string;
}

interface RegionConfig {
  id: string;
  regionCode: string;
  regionName: string;
  primaryDatabase: string;
  dataResidency: boolean;
  isActive: boolean;
}

interface InfrastructureStore {
  nodes: InfrastructureNode[];
  regions: RegionConfig[];
  fetchInfrastructure: () => Promise<void>;
}

export const useInfrastructureStore = create<InfrastructureStore>((set) => ({
  nodes: [],
  regions: [],
  fetchInfrastructure: async () => {
    try {
      const [nodesRes, regionsRes] = await Promise.all([
        ApiClient.get<any>("/infrastructure/nodes"),
        ApiClient.get<any>("/infrastructure/regions"),
      ]);
      set({ nodes: nodesRes?.data || nodesRes || [], regions: regionsRes?.data || regionsRes || [] });
    } catch (error) {
      console.error("Failed to fetch infrastructure:", error);
    }
  },
}));
