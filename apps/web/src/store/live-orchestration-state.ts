import { create } from "zustand";

export interface TimeSeriesData {
  time: string;
  cpuLoad: number;
  activeNodes: number;
  networkLatency: number;
}

export interface AnomalyEvent {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  timestamp: string;
  node: string;
}

export interface OrchestrationEvent {
  id: string;
  type: "DISPATCH" | "SCALE" | "SYNC" | "COMPUTE";
  target: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  timestamp: string;
}

export interface ExecutionNode {
  id: string;
  lat: number;
  lng: number;
  status: "HEALTHY" | "STRESSED" | "OFFLINE";
  workload: number; // 0 to 100
}

interface LiveOrchestrationState {
  // Streaming Chart Data
  metricsStream: TimeSeriesData[];
  appendMetrics: (data: TimeSeriesData) => void;

  // Anomalies
  anomalies: AnomalyEvent[];
  addAnomaly: (anomaly: AnomalyEvent) => void;

  // Timeline Events
  orchestrationEvents: OrchestrationEvent[];
  addOrchestrationEvent: (event: OrchestrationEvent) => void;

  // Map Nodes
  executionNodes: ExecutionNode[];
  updateNodes: (nodes: ExecutionNode[]) => void;
}

const MAX_STREAM_LENGTH = 50;
const MAX_EVENTS_LENGTH = 100;

export const useLiveOrchestratorStore = create<LiveOrchestrationState>((set) => ({
  metricsStream: [],

  appendMetrics: (data) =>
    set((state) => ({
      metricsStream: [...state.metricsStream, data].slice(-MAX_STREAM_LENGTH),
    })),

  anomalies: [],
  addAnomaly: (anomaly) =>
    set((state) => ({
      anomalies: [anomaly, ...state.anomalies].slice(0, 10),
    })),

  orchestrationEvents: [],
  addOrchestrationEvent: (event) =>
    set((state) => ({
      orchestrationEvents: [event, ...state.orchestrationEvents].slice(0, MAX_EVENTS_LENGTH),
    })),

  executionNodes: [],
  updateNodes: (nodes) => set({ executionNodes: nodes }),
}));
