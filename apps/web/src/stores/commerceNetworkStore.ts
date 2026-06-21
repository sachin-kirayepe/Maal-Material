import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface CommerceNode {
  id: string;
  entityId: string;
  nodeType: string;
  region: string;
  reputationScore: number;
}

interface CommerceEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  strength: number;
}

interface CommerceNetworkState {
  nodes: CommerceNode[];
  edges: CommerceEdge[];
  isLoading: boolean;
  fetchGraph: (_tenantId: string) => Promise<void>;
}

export const useCommerceNetworkStore = create<CommerceNetworkState>((set) => ({
  nodes: [],
  edges: [],
  isLoading: false,
  fetchGraph: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>("/v1/commerce-network/graph", { params: { tenantId } });
      const data = response?.data || response || { nodes: [], edges: [] };
      set({
        isLoading: false,
        nodes: data.nodes || [],
        edges: data.edges || [],
      });
    } catch (err) {
      console.error(err);
      set({ isLoading: false, nodes: [], edges: [] });
    }
  },
}));
