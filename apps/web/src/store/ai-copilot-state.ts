import { create } from "zustand";
import api from "@/lib/api";

export type Role = "user" | "assistant" | "system";

export interface ActionPayload {
  id: string;
  type: "APPROVE_WORKFLOW" | "EXECUTE_QUERY" | "ADJUST_PARAMETERS";
  description: string;
  isExecuted: boolean;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  action?: ActionPayload;
}

interface AICopilotState {
  isOpen: boolean;
  isStreaming: boolean;
  messages: Message[];
  currentContext: string | null;

  // Actions
  toggleCopilot: () => void;
  setContext: (context: string | null) => void;
  sendMessage: (content: string, tenantId?: string) => Promise<void>;
  executeAction: (messageId: string, actionId: string, tenantId?: string) => Promise<void>;
}

export const useAICopilotStore = create<AICopilotState>((set, get) => ({
  isOpen: false,
  isStreaming: false,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Maal-Material Copilot initialized. All systems online. Awaiting your directive.",
      timestamp: Date.now(),
    },
  ],
  currentContext: null,

  toggleCopilot: () => set((state) => ({ isOpen: !state.isOpen })),

  setContext: (context) => set({ currentContext: context }),

  sendMessage: async (content: string, tenantId?: string) => {
    // 1. Add user message
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    try {
      const response = await api.post("/ai/copilot/message", {
        message: content,
        context: get().currentContext,
        tenantId,
      });

      const data = response.data;
      const botMsg: Message = {
        id: data.id || Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.content || "Understood.",
        timestamp: Date.now(),
        action: data.action,
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isStreaming: false,
      }));
    } catch (error) {
      console.error("Failed to send message to copilot:", error);

      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "system",
        content: "Error: Connection to AI Core failed.",
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, errorMsg],
        isStreaming: false,
      }));
    }
  },

  executeAction: async (messageId: string, actionId: string, tenantId?: string) => {
    // Mark as executing locally first
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id === messageId && msg.action && msg.action.id === actionId) {
          return {
            ...msg,
            action: { ...msg.action, isExecuted: true },
          };
        }
        return msg;
      }),
    }));

    try {
      const response = await api.post("/ai/copilot/action", {
        actionId,
        messageId,
        tenantId,
      });

      const confirmationMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "system",
        content:
          response.data?.message ||
          `Workflow ${actionId} successfully executed by autonomous orchestration engine.`,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, confirmationMsg],
      }));
    } catch (error) {
      console.error("Failed to execute action:", error);

      // Revert executed status on failure
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (msg.id === messageId && msg.action && msg.action.id === actionId) {
            return {
              ...msg,
              action: { ...msg.action, isExecuted: false },
            };
          }
          return msg;
        }),
      }));
    }
  },
}));
