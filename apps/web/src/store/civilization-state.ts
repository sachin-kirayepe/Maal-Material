import { create } from "zustand";

export interface TelemetryData {
  packetLoss: number;
  latency: number;
  thermalStress: number;
  activeNodes: number;
}

export interface M2MTransaction {
  id: string;
  buyerId: string;
  sellerId: string;
  serviceType: string;
  value: number;
  timestamp: string;
}

interface CivilizationState {
  // Global Telemetry
  telemetry: TelemetryData;
  updateTelemetry: (data: Partial<TelemetryData>) => void;

  // Active Fleets
  activeFleets: string[];
  addFleet: (fleetName: string) => void;

  // Economy Ledger
  transactions: M2MTransaction[];
  addTransaction: (tx: M2MTransaction) => void;

  // System Status
  orchestrationMode: "IDLE" | "SIMULATING" | "DISPATCHING" | "SYNCING";
  setOrchestrationMode: (mode: "IDLE" | "SIMULATING" | "DISPATCHING" | "SYNCING") => void;
}

export const useCivilizationStore = create<CivilizationState>((set) => ({
  telemetry: {
    packetLoss: 0.001,
    latency: 12,
    thermalStress: 0.2,
    activeNodes: 14500,
  },
  updateTelemetry: (data) => set((state) => ({ telemetry: { ...state.telemetry, ...data } })),

  activeFleets: ["ALPHA_SWARM", "BETA_LOGISTICS"],
  addFleet: (fleetName) => set((state) => ({ activeFleets: [...state.activeFleets, fleetName] })),

  transactions: [],
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions].slice(0, 50), // Keep last 50 transactions for performance
    })),

  orchestrationMode: "IDLE",
  setOrchestrationMode: (mode) => set({ orchestrationMode: mode }),
}));
