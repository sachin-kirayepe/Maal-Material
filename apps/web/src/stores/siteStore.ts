import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

interface ProjectSite {
  id: string;
  projectId: string;
  name: string;
  siteCode: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  siteStatus: string;
  managerId?: string;
  project?: { name: string; projectCode: string };
  _count?: { siteInventory: number; attendances: number; materialConsumption: number };
}

interface SiteState {
  sites: ProjectSite[];
  currentSite: ProjectSite | null;
  siteInventory: any[];
  isLoading: boolean;
  error: string | null;
  meta: any;

  fetchSites: (query?: any) => Promise<void>;
  fetchSiteById: (id: string) => Promise<void>;
  createSite: (dto: any) => Promise<ProjectSite>;
  setCurrentSite: (site: ProjectSite | null) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  sites: [],
  currentSite: null,
  siteInventory: [],
  isLoading: false,
  error: null,
  meta: null,

  fetchSites: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params: any = {};
      if (query.projectId) params.projectId = query.projectId;
      if (query.status) params.status = query.status;
      if (query.search) params.search = query.search;
      if (query.page) params.page = query.page;

      const data = await ApiClient.get<any>("/sites", { params });
      set({ sites: data?.data?.items || data?.data || data || [], meta: data?.meta, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSiteById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.get<any>(`/sites/${id}`);
      const json = data?.data || data;
      set({ currentSite: json, siteInventory: json?.siteInventory || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createSite: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiClient.post<any>("/sites", dto);
      const json = data?.data || data;
      set((state) => ({ sites: [json, ...state.sites], isLoading: false }));
      return json;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setCurrentSite: (site) => set({ currentSite: site }),
}));
