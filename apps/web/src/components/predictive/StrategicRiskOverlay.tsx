import React from "react";
import { usePredictiveStore } from "../../store/predictive-state";
import {
  BrainCircuit as BrainCircuitIcon,
  AlertTriangle as AlertTriangleIcon,
  Lightbulb as LightbulbIcon,
  ShieldAlert as ShieldAlertIcon,
  TrendingDown as TrendingDownIcon,
} from "lucide-react";
const BrainCircuit = BrainCircuitIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const Lightbulb = LightbulbIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const TrendingDown = TrendingDownIcon as any;

export function StrategicRiskOverlay() {
  const { forecastData, variables } = usePredictiveStore();

  // Determine highest risk
  const maxRisk = Math.max(...forecastData.map((d) => d.riskProbability), 0);
  const totalMarginImpact = forecastData.reduce(
    (acc, curr) =>
      acc + (curr.scenarioRevenue - curr.scenarioCost - (curr.baselineRevenue - curr.baselineCost)),
    0,
  );

  // AI Logic for Recommendations
  const recommendations = [];

  if (variables.materialCostShift > 20) {
    recommendations.push({
      id: 1,
      type: "warning",
      title: "Material Cost Exposure",
      desc: "Simulated raw material price spikes exceed 20%. Consider locking in long-term supplier contracts immediately to hedge against this variance.",
      icon: <TrendingDown className="w-4 h-4" />,
    });
  }

  if (variables.logisticsDelayMultiplier > 1.5) {
    recommendations.push({
      id: 2,
      type: "critical",
      title: "Logistics Cascade Failure",
      desc: "Port delays simulated >50%. This will cause stockouts by Q3. Shift 30% of maritime freight to air-cargo to preserve SLA integrity.",
      icon: <AlertTriangle className="w-4 h-4" />,
    });
  }

  if (maxRisk > 60) {
    recommendations.push({
      id: 3,
      type: "critical",
      title: "Operational Margin Collapse",
      desc: `Simulated parameters indicate an unsustainable operating margin. Projected variance is -$${Math.abs(totalMarginImpact / 1000000).toFixed(1)}M. Initiate emergency cost-reduction protocol Alpha.`,
      icon: <ShieldAlert className="w-4 h-4" />,
    });
  } else if (totalMarginImpact > 0) {
    recommendations.push({
      id: 4,
      type: "opportunity",
      title: "Growth Opportunity",
      desc: `Simulation yields a net positive margin variance of +$${(totalMarginImpact / 1000000).toFixed(1)}M. Allocate excess liquidity to R&D.`,
      icon: <Lightbulb className="w-4 h-4" />,
    });
  }

  // Fallback
  if (recommendations.length === 0) {
    recommendations.push({
      id: 5,
      type: "stable",
      title: "Stable Trajectory",
      desc: "Simulation falls within acceptable historical variance. No immediate strategic intervention required.",
      icon: <BrainCircuit className="w-4 h-4" />,
    });
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BrainCircuit className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Strategic Insight</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Cognitive Risk Assessment
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-xl border animate-in slide-in-from-right duration-500 ${
              rec.type === "critical"
                ? "bg-red-500/10 border-red-500/30"
                : rec.type === "warning"
                  ? "bg-amber-500/10 border-amber-500/30"
                  : rec.type === "opportunity"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-slate-800/50 border-white/5"
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold mb-2 ${
                rec.type === "critical"
                  ? "text-red-400"
                  : rec.type === "warning"
                    ? "text-amber-400"
                    : rec.type === "opportunity"
                      ? "text-emerald-400"
                      : "text-slate-300"
              }`}
            >
              {rec.icon} {rec.title}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{rec.desc}</p>
          </div>
        ))}
      </div>

      {/* Financial Impact Footer */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
              Total Simulated Impact
            </div>
            <div
              className={`text-2xl font-mono font-bold ${totalMarginImpact < 0 ? "text-red-400" : "text-emerald-400"}`}
            >
              {totalMarginImpact < 0 ? "-" : "+"}$
              {(Math.abs(totalMarginImpact) / 1000000).toFixed(2)}M
            </div>
          </div>

          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-white/10">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
