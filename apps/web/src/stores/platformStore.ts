import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface PlatformService {
  id: string;
  serviceName: string;
  version: string;
  status: string;
  contracts: any[];
}

export interface PlatformExtension {
  id: string;
  extensionName: string;
  publisher: string;
  version: string;
  status: string;
}

interface PlatformStore {
  services: PlatformService[];
  extensions: PlatformExtension[];
  fetchPlatform: () => Promise<void>;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
  services: [],
  extensions: [],
  fetchPlatform: async () => {
    try {
      const [servicesData, extensionsData] = await Promise.all([
        ApiClient.get<any>("/platform/services"),
        ApiClient.get<any>("/platform/extensions"),
      ]);
      set({ 
        services: servicesData.data || servicesData || [], 
        extensions: extensionsData.data || extensionsData || [] 
      });
    } catch (error) {
      console.error("Failed to fetch platform info:", error);
    }
  },
}));
