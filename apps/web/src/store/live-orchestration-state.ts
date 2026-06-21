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
  metricsStream: Array.from({ length: 20 }).map((_, i) => ({
    time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString([], {
      hour12: false,
      second: "2-digit",
      minute: "2-digit",
    }),
    cpuLoad: 20 + Math.random() * 10,
    activeNodes: 12000,
    networkLatency: 10 + Math.random() * 5,
  })),

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

  executionNodes: [
    { id: "ALPHA-01", lat: 34.05, lng: -118.24, status: "HEALTHY", workload: 45 },
    { id: "BETA-09", lat: 40.71, lng: -74.0, status: "STRESSED", workload: 88 },
    { id: "GAMMA-42", lat: 51.5, lng: -0.12, status: "HEALTHY", workload: 32 },
    { id: "DELTA-11", lat: 35.68, lng: 139.76, status: "HEALTHY", workload: 65 },
    { id: "EPSILON-99", lat: 1.35, lng: 103.81, status: "OFFLINE", workload: 0 },
  ],
  updateNodes: (nodes) => set({ executionNodes: nodes }),
}));
