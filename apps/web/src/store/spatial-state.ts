import { create } from "zustand";
import api from "../utils/api";
export type SimulationMode = "standard" | "heatmap" | "predictive" | "xray";

export interface SpatialNode {
  id: string;
  type: "rack" | "machine" | "drone" | "conveyor";
  position: [number, number, number];
  status: "optimal" | "warning" | "critical" | "idle";
  loadPercentage: number;
  temperature: number; // 0-100
  metadata: {
    name: string;
    description: string;
    lastMaintenance?: string;
  };
}

interface SpatialState {
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  nodes: Record<string, SpatialNode>;
  updateNode: (node: SpatialNode) => void;

  // Camera state
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;

  isSimulationRunning: boolean;
  toggleSimulation: () => void;

  syncWithWarehouse: () => Promise<void>;
}

export const useSpatialStore = create<SpatialState>((set) => ({
  simulationMode: "standard",
  setSimulationMode: (mode) => set({ simulationMode: mode }),

  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  nodes: {},
  updateNode: (node) => set((state) => ({ nodes: { ...state.nodes, [node.id]: node } })),

  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),

  isSimulationRunning: true,
  toggleSimulation: () => set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),

  syncWithWarehouse: async () => {
    try {
      const response = await api.get("/warehouses");
      const warehouses = response.data?.data || [];

      const newNodes: Record<string, SpatialNode> = {};

      // Transform warehouse data into 3D nodes
      warehouses.forEach((w: any, index: number) => {
        newNodes[w.id] = {
          id: w.id,
          type: "rack",
          position: [index * 10 - 15, 0, index % 2 === 0 ? 5 : -5], // Dynamic layout
          status: w.capacity > 90 ? "critical" : w.capacity > 75 ? "warning" : "optimal",
          loadPercentage: w.capacity || 0,
          temperature: 22 + (index % 5),
          metadata: {
            name: w.name,
            description: w.location || "Warehouse node",
            lastMaintenance: new Date().toISOString(),
          },
        };
      });

      set({ nodes: newNodes });
    } catch (error) {
      console.error("Failed to sync spatial digital twin with warehouses", error);
    }
  },
}));
