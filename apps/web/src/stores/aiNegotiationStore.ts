import { create } from "zustand";
import { ledgerService } from "../core/domain/finance/ledger-service";
import { ApiClient } from "@/lib/api-client";

export interface ChatMessage {
  id: string;
  sender: "SYSTEM" | "AI" | "USER";
  text: string;
  timestamp: string;
  meta?: {
    proposedPrice?: number;
    proposedQuantity?: number;
    accepted?: boolean;
    productId?: string;
  };
}

export interface AINegotiationState {
  isNegotiating: boolean;
  activeProductId: string | null;
  messages: ChatMessage[];
  basePrice: number;
  minAllowedPrice: number;

  startNegotiation: (productId: string, basePrice: number, productName: string) => void;
  sendMessage: (
    text: string,
    proposedQuantity?: number,
    proposedPrice?: number,
    tenantId?: string,
  ) => Promise<void>;
  acceptOffer: (messageId: string, tenantId?: string) => Promise<void>;
  rejectOffer: (messageId: string, tenantId?: string) => Promise<void>;
  endNegotiation: () => void;
}

const generateId = () => crypto.randomUUID();

export const useAINegotiationStore = create<AINegotiationState>((set, get) => ({
  isNegotiating: false,
  activeProductId: null,
  messages: [],
  basePrice: 0,
  minAllowedPrice: 0,

  startNegotiation: (productId: string, basePrice: number, productName: string) => {
    const systemMsg: ChatMessage = {
      id: generateId(),
      sender: "SYSTEM",
      text: `Negotiation Channel Opened securely for: ${productName}. Base Listed Price: $${basePrice.toLocaleString()}`,
      timestamp: new Date().toISOString(),
    };

    const aiMsg: ChatMessage = {
      id: generateId(),
      sender: "AI",
      text: `Greetings. I am the Maal-Material Autonomous Trade Negotiator. I am authorized to offer dynamic bulk pricing for ${productName}. What volume are you looking to procure today?`,
      timestamp: new Date().toISOString(),
    };

    set({
      isNegotiating: true,
      activeProductId: productId,
      basePrice: basePrice,
      minAllowedPrice: basePrice * 0.8, // Max 20% discount
      messages: [systemMsg, aiMsg],
    });
  },

  sendMessage: async (
    text: string,
    proposedQuantity = 1,
    proposedPrice?: number,
    tenantId?: string,
  ) => {
    const { messages, basePrice, minAllowedPrice } = get();

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: "USER",
      text,
      timestamp: new Date().toISOString(),
      meta: { proposedQuantity, proposedPrice },
    };

    set({ messages: [...messages, userMsg] });

    try {
      const { activeProductId } = get();
      if (!activeProductId) return;

      // Real network call handling the dynamic pricing logic
      const response = await ApiClient.post<any>("/ai/negotiate", {
        activeProductId,
        text,
        proposedQuantity,
        proposedPrice,
        basePrice,
        minAllowedPrice,
        tenantId,
      });

      const aiMsg: ChatMessage = {
        id: generateId(),
        sender: "AI",
        text: response?.data?.message || response?.message || "I have received your proposal.",
        timestamp: new Date().toISOString(),
        meta: {
          proposedPrice: response?.data?.offerPrice || response?.offerPrice || basePrice,
          proposedQuantity,
          accepted: false,
        },
      };

      set((state) => ({ messages: [...state.messages, aiMsg] }));
    } catch (err) {
      console.error("Negotiation API error:", err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: generateId(),
        sender: "SYSTEM",
        text: "Network anomaly detected. AI Negotiator offline.",
        timestamp: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, errorMsg] }));
    }
  },

  acceptOffer: async (messageId: string, tenantId?: string) => {
    set((state) => {
      const updatedMessages = state.messages.map((m) =>
        m.id === messageId ? { ...m, meta: { ...m.meta, accepted: true } } : m,
      );

      const dealMsg = state.messages.find((m) => m.id === messageId);

      // Inject deal into Predictive Store via Ledger Service
      if (dealMsg && dealMsg.meta) {
        const revenue = (dealMsg.meta.proposedPrice || 0) * (dealMsg.meta.proposedQuantity || 0);
        ledgerService.recordDeal(
          "Global_Corp_01",
          revenue,
          state.activeProductId || "unknown",
          dealMsg.meta.proposedQuantity || 1,
        );
      }

      const systemMsg: ChatMessage = {
        id: generateId(),
        sender: "SYSTEM",
        text: `SMART CONTRACT EXECUTED. Immutable ledger record generated. Fulfillment pipeline activated.`,
        timestamp: new Date().toISOString(),
      };

      return { messages: [...updatedMessages, systemMsg] };
    });

    try {
      await ApiClient.post<any>("/ai/negotiate/accept", { messageId, tenantId });
    } catch (e) {
      console.error("Failed to notify backend of acceptance:", e);
    }
  },

  rejectOffer: async (messageId: string, tenantId?: string) => {
    const aiMsg: ChatMessage = {
      id: generateId(),
      sender: "AI",
      text: `I understand. If your procurement parameters change, our marketplace remains open. Negotiation paused.`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, aiMsg] }));

    try {
      await ApiClient.post<any>("/ai/negotiate/reject", { messageId, tenantId });
    } catch (e) {
      console.error("Failed to notify backend of rejection:", e);
    }
  },

  endNegotiation: () => {
    set({ isNegotiating: false, activeProductId: null, messages: [] });
  },
}));
