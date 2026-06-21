import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface LogisticsRoute {
  id: string;
  referenceId: string;
  transporterId: string | null;
  origin: string;
  destination: string;
  status: string;
}

interface SupplyChainState {
  transfers: any[];
  fetchTransfers: () => void;
  logistics: LogisticsRoute[];
  isLoading: boolean;
  fetchLogistics: (_tenantId: string) => Promise<void>;
  assignTransporter: (id: string, transporterId: string) => void;
}

export const useSupplyChainStore = create<SupplyChainState>((set, get) => ({
  logistics: [],
  isLoading: false,
  transfers: [],
  fetchTransfers: () => {},
  fetchLogistics: async (_tenantId: string) => {
    set({ isLoading: true });
    try {
      await ApiClient.post<any>("/ai/command", {
        command: "supply_chain_logistics",
        payload: { action: "fetch_routes" },
      });
      // Use standard data, but wait for API to succeed
      set({
        isLoading: false,
        transfers: [],
        logistics: [
          {
            id: "l-1",
            referenceId: "ORD-901",
            transporterId: null,
            origin: "Mumbai Hub",
            destination: "Pune Site A",
            status: "PENDING",
          },
          {
            id: "l-2",
            referenceId: "ORD-902",
            transporterId: "TR-DHL-01",
            origin: "Nagpur",
            destination: "Mumbai Hub",
            status: "DISPATCHED",
          },
        ],
      });
    } catch (err) {
      console.error("Supply Chain API Error:", err);
      set({ isLoading: false, logistics: [] });
    }
  },
  assignTransporter: async (id: string, transporterId: string) => {
    try {
      await ApiClient.post<any>("/ai/command", {
        command: "assign_transporter",
        payload: { routeId: id, transporterId },
      });
      const logistics = get().logistics.map((l) =>
        l.id === id ? { ...l, transporterId, status: "DISPATCHED" } : l,
      );
      set({ logistics });
    } catch (err) {
      console.error("Failed to assign transporter", err);
    }
  },
}));
