import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface EquipmentAssignment {
  id: string;
  equipmentName: string;
  assignedTo: string;
  status: string;
  usageHours: number;
  fuelConsumed: number;
}

interface EquipmentState {
  assignments: EquipmentAssignment[];
  isLoading: boolean;
  fetchAssignments: (projectId?: string) => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  assignments: [],
  isLoading: false,
  fetchAssignments: async (projectId) => {
    set({ isLoading: true });
    try {
      const params = projectId ? { projectId } : undefined;
      const data = await ApiClient.get<any>("/construction/equipment/assignments", { params });
      set({ assignments: data.data || data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
