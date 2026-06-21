import { create } from "zustand";

interface ConstructionProject {
  id: string;
  name: string;
  code: string;
  status: string;
  budget: number;
  costToDate: number;
  profitability: number;
  completionPercentage: number;
}

interface ProjectState {
  projects: ConstructionProject[];
  activeProject: ConstructionProject | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  setActiveProject: (project: ConstructionProject) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res: any = await fetch("http://localhost:3001/api/v1/construction/projects");
      if (res.ok) {
        const data = await res.json();
        set({ projects: data, isLoading: false });
      }
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  setActiveProject: (project) => set({ activeProject: project }),
}));
