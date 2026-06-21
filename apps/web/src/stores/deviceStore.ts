import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface MobileDevice {
  id: string;
  deviceUuid: string;
  name: string;
  os: string;
  status: string;
  batteryLevel: number;
  updatedAt: string;
}

interface DeviceStore {
  devices: MobileDevice[];
  isLoading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  blockDevice: (id: string) => Promise<void>;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  isLoading: false,
  error: null,
  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>("/device-management/devices");
      set({ devices: data.data || data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  blockDevice: async (id: string) => {
    try {
      await ApiClient.post<any>(`/device-management/devices/${id}/block`, {});
      get().fetchDevices();
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
