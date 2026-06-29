import { create } from "zustand";
import api from "../utils/api";

export type ScenarioType = "Baseline" | "Aggressive" | "Conservative";

export interface PredictiveVariables {
  materialCostShift: number; // Percentage (-50 to +50)
  logisticsDelayMultiplier: number; // Multiplier (1.0 to 3.0)
  demandSpike: number; // Percentage (-30 to +100)
}

export interface DataPoint {
  month: string;
  baselineRevenue: number;
  scenarioRevenue: number;
  baselineCost: number;
  scenarioCost: number;
  riskProbability: number;
}

interface PredictiveState {
  activeScenario: ScenarioType;
  variables: PredictiveVariables;
  isSimulating: boolean;
  forecastData: DataPoint[];

  // Actions
  setActiveScenario: (scenario: ScenarioType) => void;
  setVariable: (key: keyof PredictiveVariables, value: number) => void;
  generateForecast: () => void;
  fetchForecastData: () => Promise<void>;
  injectLiveRevenueSpike: (revenue: number) => void;
}

// Helper to generate months
const generateMonths = (count: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(
      `${months[(currentMonth + i) % 12]} '${String(new Date().getFullYear() + Math.floor((currentMonth + i) / 12)).slice(2)}`,
    );
  }
  return result;
};

// Initial base forecast logic
const baseMonths = generateMonths(12);

export const usePredictiveStore = create<PredictiveState>((set, get) => ({
  activeScenario: "Baseline",
  variables: {
    materialCostShift: 0,
    logisticsDelayMultiplier: 1.0,
    demandSpike: 0,
  },
  isSimulating: false,
  forecastData: [],

  setActiveScenario: (scenario) => set({ activeScenario: scenario }),

  setVariable: (key, value) =>
    set((state) => {
      const newVariables = { ...state.variables, [key]: value };
      return { variables: newVariables };
    }),

  generateForecast: () =>
    set((state) => {
      // Generate deterministic but dynamic data based on variables
      const { materialCostShift, logisticsDelayMultiplier, demandSpike } = state.variables;

      let currentBaseRevenue = 5000000;
      let currentBaseCost = 3000000;

      const newData: DataPoint[] = baseMonths.map((month, index) => {
        // Natural progression
        currentBaseRevenue *= 1.02; // 2% MoM growth
        currentBaseCost *= 1.015;

        // Apply scenario impacts (compounding over time)
        const timeFactor = (index + 1) / 12; // Impacts grow over time

        const demandImpact = 1 + (demandSpike / 100) * timeFactor;
        const costImpact = 1 + (materialCostShift / 100) * timeFactor;
        const logisticsImpact = logisticsDelayMultiplier; // Directly hits revenue and cost

        const scenarioRevenue =
          currentBaseRevenue * demandImpact * (1 / (1 + (logisticsImpact - 1) * 0.2));
        const scenarioCost = currentBaseCost * costImpact * logisticsImpact;

        // Calculate a pseudo risk probability (0 to 100)
        const margin = scenarioRevenue - scenarioCost;
        const baseMargin = currentBaseRevenue - currentBaseCost;

        let risk = 20; // Base risk
        if (margin < baseMargin) {
          risk += ((baseMargin - margin) / baseMargin) * 100;
        }
        if (logisticsDelayMultiplier > 1.5) risk += 20;
        if (materialCostShift > 20) risk += 15;

        return {
          month,
          baselineRevenue: Math.round(currentBaseRevenue),
          scenarioRevenue: Math.round(scenarioRevenue),
          baselineCost: Math.round(currentBaseCost),
          scenarioCost: Math.round(scenarioCost),
          riskProbability: Math.min(100, Math.max(0, Math.round(risk))),
        };
      });

      return { forecastData: newData };
    }),

  fetchForecastData: async () => {
    try {
      const response = await api.get("/predictions/forecasts");
      const data = response.data?.data;
      if (data && Array.isArray(data) && data.length > 0) {
        set({ forecastData: data });
      }
    } catch (error) {
      console.error("Failed to fetch forecasts from API", error);
    }
  },

  injectLiveRevenueSpike: (revenue) =>
    set((state) => {
      // Inject the revenue into the first month's scenario revenue to visualize a spike
      const newData = [...state.forecastData];
      if (newData.length > 0 && newData[0]) {
        newData[0] = {
          ...newData[0],
          scenarioRevenue: newData[0].scenarioRevenue + revenue,
        };
      }
      return { forecastData: newData };
    }),
}));

// Initialize the store only in the browser (skip during SSG/SSR build)
if (typeof window !== "undefined") {
  usePredictiveStore.getState().fetchForecastData();
}
