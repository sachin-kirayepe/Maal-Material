import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface FailureEvent {
  id: string;
  serviceName: string;
  errorType: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface RetryJob {
  id: string;
  jobType: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  nextRetryAt: string;
}

interface ResilienceState {
  failures: FailureEvent[];
  retries: RetryJob[];
  isLoading: boolean;
  error: string | null;
  fetchFailures: () => Promise<void>;
  fetchRetries: () => Promise<void>;
  resolveFailure: (id: string) => Promise<void>;
}

export const useResilienceStore = create<ResilienceState>((set, get) => ({
  failures: [],
  retries: [],
  isLoading: false,
  error: null,

  fetchFailures: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/resilience/failures");
      set({ failures: response?.data || response || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchRetries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/resilience/retries");
      set({ retries: response?.data || response || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  resolveFailure: async (id: string) => {
    try {
      await ApiClient.post<any>(`/resilience/failures/${id}/resolve`, {});
      const { failures } = get();
      set({
        failures: failures.map((f) =>
          f.id === id ? { ...f, isResolved: true, resolvedAt: new Date().toISOString() } : f,
        ),
      });
    } catch (err: any) {
      console.error("Failed to resolve failure:", err);
    }
  },
}));
