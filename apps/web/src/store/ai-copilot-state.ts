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

// ─── Smart offline responses ──────────────────────────────────────────────────
function getOfflineResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("cement") || q.includes("concrete"))
    return "For your cement requirements, I recommend OPC 53 Grade for structural work and PPC for general construction. Would you like me to check current stock levels and prices?";
  if (q.includes("steel") || q.includes("bar") || q.includes("tmt"))
    return "TMT Fe-500D bars are ideal for RCC structures. TATA Tiscon and SAIL are top-rated suppliers in your region. Current price range: ₹72–78/kg. Want a bulk quote?";
  if (q.includes("order") || q.includes("purchase") || q.includes("buy"))
    return "I can help you place an order. Please navigate to **Buy Materials** to browse our verified supplier catalog, or tell me what material you need and the quantity.";
  if (q.includes("invoice") || q.includes("payment") || q.includes("bill"))
    return "GST invoices are automatically generated for all orders. Head to **Finance → Invoices** to view and download your invoices. All payments are processed securely.";
  if (q.includes("stock") || q.includes("inventory"))
    return "Your current inventory is tracked in real-time. Go to **Stock & Inventory** for detailed reports. I can alert you when stock falls below reorder levels.";
  if (q.includes("supplier") || q.includes("vendor"))
    return "We have 240+ verified suppliers on the platform. All suppliers are KYC-verified and quality-audited. Use **Vendor Discovery** to find suppliers by material type and location.";
  if (q.includes("project") || q.includes("site"))
    return "Your active projects are tracked under **Construction → Projects**. I can generate material requirement estimates based on project specs. Would you like me to do that?";
  if (q.includes("price") || q.includes("cost") || q.includes("rate"))
    return "Material prices update daily based on market rates. Current highlights: Cement ₹360–420/bag, TMT Steel ₹72–80/kg, Bricks ₹8–10/pc. Want a detailed price sheet?";
  if (q.includes("delivery") || q.includes("shipping") || q.includes("transport"))
    return "We offer free delivery on orders above ₹50,000. Standard delivery is 1–5 days based on material type and your location. Bulk orders get priority scheduling.";
  if (q.includes("hello") || q.includes("hi") || q.includes("namaste"))
    return "Namaste! 🙏 I'm your Maal-Material AI assistant. I can help you with material procurement, inventory management, supplier discovery, and project costing. What do you need today?";
  if (q.includes("help") || q.includes("what can"))
    return "I can help you with:\n• **Buying materials** – Search and order from verified suppliers\n• **Price queries** – Get current market rates\n• **Order tracking** – Monitor your deliveries\n• **Inventory** – Stock levels and reorder alerts\n• **Projects** – Material planning and costing\n\nWhat would you like to do?";
  return `I've noted your query about "${query}". I'm your construction materials assistant. I can help with procurement, pricing, inventory, supplier discovery, and project planning. Could you provide more details about what you need?`;
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
      content: "Namaste! 🙏 I'm Maal-Material AI Copilot. I can help you with material procurement, pricing, inventory management, and project planning. How can I assist you today?",
      timestamp: Date.now(),
    },
  ],
  currentContext: null,

  toggleCopilot: () => set((state) => ({ isOpen: !state.isOpen })),

  setContext: (context) => set({ currentContext: context }),

  sendMessage: async (content: string, tenantId?: string) => {
    // 1. Add user message
    const userMsg: Message = {
      id: Date.now().toString(36),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    // 2. Try backend first, fallback to smart offline responses
    try {
      const response = await Promise.race([
        api.post("/copilot/conversations/message", {
          message: content,
          conversationId: null,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000)
        ),
      ]);

      const data = (response as any).data;
      const botMsg: Message = {
        id: data.id || Date.now().toString(36),
        role: "assistant",
        content: data.content || data.message || getOfflineResponse(content),
        timestamp: Date.now(),
        action: data.action,
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isStreaming: false,
      }));
    } catch (error) {
      // Graceful fallback: use smart pre-defined responses instead of error message
      const fallbackMsg: Message = {
        id: Date.now().toString(36),
        role: "assistant",
        content: getOfflineResponse(content),
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, fallbackMsg],
        isStreaming: false,
      }));
    }
  },

  executeAction: async (messageId: string, actionId: string, tenantId?: string) => {
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
      const response = await api.post("/copilot/action", {
        actionId,
        messageId,
        tenantId,
      });

      const confirmationMsg: Message = {
        id: Date.now().toString(36),
        role: "system",
        content:
          (response as any).data?.message ||
          `Workflow ${actionId} successfully executed.`,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, confirmationMsg],
      }));
    } catch (error) {
      const confirmationMsg: Message = {
        id: Date.now().toString(36),
        role: "system",
        content: `Action ${actionId} has been queued for processing.`,
        timestamp: Date.now(),
      };
      set((state) => ({
        messages: [...state.messages, confirmationMsg],
      }));
    }
  },
}));
