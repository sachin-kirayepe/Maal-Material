import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  pricing?: {
    dailyRate: number;
    hourlyRate: number;
  };
}

interface EquipmentState {
  equipment: Equipment[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  fetchEquipment: (tenantId: string, page?: number, limit?: number) => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  equipment: [],
  meta: null,
  isLoading: false,
  fetchEquipment: async (tenantId: string, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/api/v1/equipment?tenantId=${tenantId}&page=${page}&limit=${limit}`);
      const data = response?.data || response;
      set({
        isLoading: false,
        equipment: data.data || data || [],
        meta: data.meta || null,
      });
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      set({ isLoading: false });
    }
  },
}));
