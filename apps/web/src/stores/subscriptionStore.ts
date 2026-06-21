import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";
import type { TenantSubscription } from "@constructos/types";

interface SubscriptionState {
  currentSubscription: TenantSubscription | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscription: (tenantId: string) => Promise<void>;
  updatePlan: (tenantId: string, planName: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, _get) => ({
  currentSubscription: null,
  isLoading: false,
  error: null,

  fetchSubscription: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/tenants/${tenantId}`);
      // The subscription is returned nested inside the tenant response
      const subs = data.data?.subscriptions || data.subscriptions;
      if (subs && subs.length > 0) {
        // Find the active one, or just take the first
        const activeSub = subs.find((s: any) => s.status === "ACTIVE") || subs[0];
        set({ currentSubscription: activeSub, isLoading: false });
      } else {
        set({ currentSubscription: null, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updatePlan: async (tenantId: string, planName: string) => {
    // Placeholder for when subscription update API is fully implemented
    console.log(`Plan change requested to ${planName} for tenant ${tenantId}`);
  },
}));
