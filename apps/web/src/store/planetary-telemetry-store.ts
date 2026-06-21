import { create } from "zustand";
import api from "../utils/api";

export type NodeStatus = "OPERATIONAL" | "DEGRADED" | "OFFLINE";

export interface EdgeNode {
  id: string;
  region: string;
  latencyMs: number;
  status: NodeStatus;
  activeConnections: number;
  cpuLoad: number; // 0-100
}

interface PlanetaryTelemetryState {
  isGlobalSyncActive: boolean;
  activeRegion: string;
  nodes: Record<string, EdgeNode>;

  // Real Backend Data Fetcher
  fetchTelemetryData: () => Promise<void>;

  // Simulation Controls (kept for compatibility, but overridden with backend data)
  simulateOutage: (regionId: string) => void;
  resolveOutage: (regionId: string) => void;
}

export const usePlanetaryTelemetryStore = create<PlanetaryTelemetryState>((set) => {
  return {
    isGlobalSyncActive: true,
    activeRegion: "us-east-1", // Default assigned edge node
    nodes: {},

    fetchTelemetryData: async () => {
      try {
        const res: any = await api.get("/infrastructure/nodes");
        const dbNodes = res.data?.data || [];

        const newNodes: Record<string, EdgeNode> = {};

        dbNodes.forEach((dbNode: any) => {
          // Map DB InfrastructureNode to EdgeNode
          newNodes[dbNode.nodeId] = {
            id: dbNode.nodeId,
            region: dbNode.region || "Unknown",
            latencyMs: Math.floor(Math.random() * 50) + 10, // Simulated network hop latency
            status: dbNode.status === "ACTIVE" ? "OPERATIONAL" : "DEGRADED",
            activeConnections: Math.floor(Math.random() * 10000), // Simulating concurrent conns
            cpuLoad: dbNode.cpuUsage || 0,
          };
        });

        set({ nodes: newNodes });
      } catch (error) {
        console.error("Failed to fetch planetary telemetry data", error);
      }
    },

    simulateOutage: (regionId) =>
      set((state) => {
        const node = state.nodes[regionId];
        if (!node) return {};
        return {
          nodes: {
            ...state.nodes,
            [regionId]: {
              ...node,
              status: "OFFLINE" as NodeStatus,
              latencyMs: 999,
              activeConnections: 0,
              cpuLoad: 0,
            },
          },
        };
      }),

    resolveOutage: (regionId) =>
      set((state) => {
        const node = state.nodes[regionId];
        if (!node) return {};
        return {
          nodes: {
            ...state.nodes,
            [regionId]: {
              ...node,
              status: "OPERATIONAL" as NodeStatus,
              latencyMs: 45,
              activeConnections: 12000,
              cpuLoad: 50,
            },
          },
        };
      }),
  };
});
