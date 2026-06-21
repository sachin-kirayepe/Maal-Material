import { create } from "zustand";

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  reasoningSteps?: string[];
  generativeAction?: {
    type: "DISPATCH_FLEET" | "REROUTE_SUPPLY" | "SCALE_COMPUTE" | "RESOLVE_ANOMALY";
    payload: any;
    status: "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED";
  };
}

interface OmniCopilotState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleCopilot: () => void;

  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearHistory: () => void;
}

export const useOmniCopilotStore = create<OmniCopilotState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleCopilot: () => set((state) => ({ isOpen: !state.isOpen })),

  messages: [
    {
      id: "init-001",
      role: "assistant",
      content:
        "Omni-Copilot Online. Enterprise Cognition Core engaged. How can I assist with your orchestration today?",
      timestamp: new Date().toISOString(),
    },
  ],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    })),
  clearHistory: () =>
    set({
      messages: [
        {
          id: `init-${Date.now()}`,
          role: "assistant",
          content: "Cognition Core reset. Awaiting instructions.",
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
