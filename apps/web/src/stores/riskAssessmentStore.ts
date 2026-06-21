import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api-client";

interface RiskAssessment {
  id: string;
  tenantId: string;
  entityId: string;
  riskType: string;
  riskScore: number;
  flagged: boolean;
  analysisDetails: string | null;
  evaluatedAt: string;
}

interface RiskAssessmentState {
  assessments: RiskAssessment[];
  isLoading: boolean;
  error: string | null;
  fetchAssessments: (tenantId: string) => Promise<void>;
}

export const useRiskAssessmentStore = create<RiskAssessmentState>()(
  persist(
    (set) => ({
      assessments: [],
      isLoading: false,
      error: null,
      fetchAssessments: async (tenantId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await ApiClient.get<any>("/risk-assessment/risks", { params: { tenantId } });
          set({ assessments: res?.data || res || [], isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
    }),
    { name: "risk-assessment-store" },
  ),
);
