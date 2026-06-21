import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface CopilotState {
  conversations: any[];
  activeConversation: any | null;
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchConversation: (id: string) => Promise<void>;
  sendMessage: (message: string, conversationId?: string) => Promise<void>;
}

export const useCopilotStore = create<CopilotState>((set, _get) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/copilot/conversations");
      set({ conversations: data?.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchConversation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/copilot/conversations/${id}`);
      set({ activeConversation: data?.data || data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (message: string, conversationId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/copilot/conversations/message", { message, conversationId });
      set({ activeConversation: data?.data || data || null, isLoading: false });
      await _get().fetchConversations();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
