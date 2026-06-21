import { create } from "zustand";
import api from "@/lib/api";

export type GovernanceLevel = "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";

export interface AutonomousEvent {
  id: string;
  timestamp: number;
  type: "SELF_HEAL" | "OPTIMIZATION" | "SECURITY" | "ECONOMIC_SHIFT";
  description: string;
  impact: string;
  resolvedTimeMs: number;
}

interface AutonomousEvolutionState {
  epoch: number;
  governanceLevel: GovernanceLevel;
  activeMutations: number;
  eventLog: AutonomousEvent[];
  isGlobalOverlayActive: boolean;
  currentOverlayEvent: AutonomousEvent | null;

  setGovernanceLevel: (level: GovernanceLevel) => void;
  fetchEvolutionState: (tenantId: string) => Promise<void>;
  clearOverlay: () => void;
}

export const useAutonomousEvolutionStore = create<AutonomousEvolutionState>((set, get) => {
  return {
    epoch: 0,
    governanceLevel: "BALANCED",
    activeMutations: 0,
    eventLog: [],
    isGlobalOverlayActive: false,
    currentOverlayEvent: null,

    setGovernanceLevel: (level) => set({ governanceLevel: level }),

    clearOverlay: () => set({ isGlobalOverlayActive: false, currentOverlayEvent: null }),

    fetchEvolutionState: async (tenantId: string) => {
      try {
        const response = await api.get(`/ai/evolution?tenantId=${tenantId}`);

        const data = response.data;
        if (data) {
          const newEvents = data.events || [];
          const state = get();

          // Determine if we have a new event to show in overlay
          let newOverlay = state.currentOverlayEvent;
          let isOverlayActive = state.isGlobalOverlayActive;

          if (newEvents.length > 0 && newEvents[0].id !== state.eventLog[0]?.id) {
            newOverlay = newEvents[0];
            isOverlayActive = true;

            // Auto hide overlay after 4 seconds
            setTimeout(() => {
              get().clearOverlay();
            }, 4000);
          }

          set({
            epoch: data.epoch || state.epoch,
            activeMutations: data.activeMutations || state.activeMutations,
            eventLog: newEvents,
            currentOverlayEvent: newOverlay,
            isGlobalOverlayActive: isOverlayActive,
          });
        }
      } catch (error) {
        console.error("Failed to fetch evolution state:", error);
      }
    },
  };
});
