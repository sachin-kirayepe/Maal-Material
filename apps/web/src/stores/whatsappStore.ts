import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface WhatsAppWorkflow {
  id: string;
  phoneNumber: string;
  workflowType: "QUOTATION" | "INVOICE" | "PAYMENT_REMINDER" | "ORDER";
  referenceId: string;
  state: string;
  updatedAt: string;
}

interface WhatsAppState {
  workflows: WhatsAppWorkflow[];
  isLoading: boolean;

  fetchWorkflows: (tenantId: string) => Promise<void>;
  initiateWorkflow: (tenantId: string, payload: any) => Promise<void>;
}

export const useWhatsAppStore = create<WhatsAppState>((set) => ({
  workflows: [],
  isLoading: false,

  fetchWorkflows: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/whatsapp-commerce/workflows", { params: { tenantId } });
      set({ workflows: response?.data || response || [] });
    } catch (error) {
      console.error("Failed to fetch WhatsApp workflows:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  initiateWorkflow: async (tenantId: string, payload: any) => {
    try {
      await ApiClient.post<any>("/whatsapp-commerce/initiate", {
        tenantId,
        ...payload,
      });
      // Refresh list after triggering
      useWhatsAppStore.getState().fetchWorkflows(tenantId);
    } catch (error) {
      console.error("Failed to initiate WhatsApp workflow:", error);
      throw error;
    }
  },
}));
