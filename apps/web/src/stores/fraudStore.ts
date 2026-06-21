import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface FraudSignal {
  id: string;
  tenantId: string;
  entityId: string;
  signalType: string;
  severity: string;
  description: string;
  status: string;
  detectedAt: string;
}

interface FraudState {
  signals: FraudSignal[];
  isLoading: boolean;
  error: string | null;
  fetchSignals: (tenantId: string) => Promise<void>;
  resolveSignal: (tenantId: string, id: string, status: string) => Promise<void>;
}

export const useFraudStore = create<FraudState>()(
  persist(
    (set, get) => ({
      signals: [],
      isLoading: false,
      error: null,
      fetchSignals: async (tenantId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await ApiClient.get<unknown>("/fraud-detection/signals", { params: { tenantId } });
          set({ signals: res?.data || res || [], isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
      resolveSignal: async (tenantId: string, id: string, status: string) => {
        try {
          await ApiClient.patch<unknown>(`/fraud-detection/signals/${id}`, { tenantId, status });
          const updatedSignals = get().signals.map((sig) =>
            sig.id === id ? { ...sig, status } : sig,
          );
          set({ signals: updatedSignals });
        } catch (err: any) {
          console.error("Failed to resolve signal", err);
        }
      },
    }),
    { name: "fraud-store" },
  ),
);
