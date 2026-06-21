import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface TrustProfile {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  trustScore: number;
  gstVerified: boolean;
  kycStatus: string;
  operationalScore: number;
  status: string;
}

interface TrustState {
  profiles: TrustProfile[];
  metrics: any;
  isLoading: boolean;
  error: string | null;
  fetchTrustProfiles: (tenantId: string) => Promise<void>;
  fetchTrustMetrics: (tenantId: string) => Promise<void>;
}

export const useTrustStore = create<TrustState>()(
  persist(
    (set) => ({
      profiles: [],
      metrics: null,
      isLoading: false,
      error: null,
      fetchTrustProfiles: async (tenantId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await ApiClient.get<any>("/trust/profiles", { params: { tenantId } });
          set({ profiles: res?.data || res || [], isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
      fetchTrustMetrics: async (tenantId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await ApiClient.get<any>("/trust/metrics", { params: { tenantId } });
          set({ metrics: res?.data || res || null, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
    }),
    { name: "trust-store" },
  ),
);
