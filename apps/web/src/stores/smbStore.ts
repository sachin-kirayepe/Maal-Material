import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface QuickAction {
  id: string;
  actionType: string;
  label: string;
  iconUrl?: string;
}

interface SmbState {
  isHindi: boolean;
  onboardingStep: number;
  businessCategory: string | null;
  quickActions: QuickAction[];
  toggleLanguage: () => void;
  setBusinessCategory: (category: string) => void;
  initializeOnboarding: (tenantId: string, shopId: string, category: string) => Promise<void>;
  completeStep: (shopId: string, step: number) => Promise<void>;
  executeQuickBill: (payload: any) => Promise<any>;
}

export const useSmbStore = create<SmbState>()(
  persist(
    (set) => ({
      isHindi: true, // Hindi-first
      onboardingStep: 1,
      businessCategory: null,
      quickActions: [],

      toggleLanguage: () => set((state) => ({ isHindi: !state.isHindi })),

      setBusinessCategory: (category) => set({ businessCategory: category }),

      initializeOnboarding: async (tenantId, shopId, category) => {
        try {
          const res = await ApiClient.post<any>("/smb-onboarding/initialize", {
            tenantId,
            shopId,
            businessCategory: category,
          });
          const data = res.data || res;
          if (data?.onboarding) {
            set({ onboardingStep: data.onboarding.currentStep, businessCategory: category });
          }
        } catch (error) {
          console.error("Onboarding init failed:", error);
        }
      },

      completeStep: async (shopId, step) => {
        try {
          await ApiClient.patch<any>(`/smb-onboarding/${shopId}/step/${step}`, {});
          set({ onboardingStep: step + 1 });
        } catch (error) {
          console.error("Failed to update step", error);
        }
      },

      executeQuickBill: async (payload) => {
        try {
          const res = await ApiClient.post<any>(
            "/simplified-workflows/quick-bill",
            payload,
          );
          return res.data || res;
        } catch (error) {
          console.error("Quick bill failed:", error);
          throw error;
        }
      },
    }),
    {
      name: "smb-storage", // Persist UX state across reloads for reliability
    },
  ),
);
