import React, { useCallback, useEffect, useState } from "react";
import { usePredictiveStore, ScenarioType } from "../../store/predictive-state";
import {
  Settings2 as Settings2Icon,
  AlertTriangle as AlertTriangleIcon,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
const Settings2 = Settings2Icon as any;
const AlertTriangle = AlertTriangleIcon as any;
const RefreshCw = RefreshCwIcon as any;

export function ScenarioControlPanel() {
  const { activeScenario, setActiveScenario, variables, setVariable, generateForecast } =
    usePredictiveStore();

  // Local state for smooth slider dragging without thrashing the global store/recharts
  const [localVars, setLocalVars] = useState(variables);
  const [isDragging, setIsDragging] = useState(false);

  // Sync back to global when not dragging
  useEffect(() => {
    if (!isDragging) setLocalVars(variables);
  }, [variables, isDragging]);

  // Debounced update to global store
  const commitChanges = useCallback(() => {
    setIsDragging(false);
    setVariable("materialCostShift", localVars.materialCostShift);
    setVariable("logisticsDelayMultiplier", localVars.logisticsDelayMultiplier);
    setVariable("demandSpike", localVars.demandSpike);
    generateForecast();
  }, [localVars, setVariable, generateForecast]);

  const scenarios: { id: ScenarioType; label: string; desc: string }[] = [
    { id: "Baseline", label: "Baseline", desc: "Expected trajectory" },
    { id: "Aggressive", label: "Aggressive", desc: "High growth, high risk" },
    { id: "Conservative", label: "Conservative", desc: "Risk mitigation focus" },
  ];

  const handleScenarioChange = (scenario: ScenarioType) => {
    setActiveScenario(scenario);
    if (scenario === "Baseline") {
      setLocalVars({ materialCostShift: 0, logisticsDelayMultiplier: 1.0, demandSpike: 0 });
    } else if (scenario === "Aggressive") {
      setLocalVars({ materialCostShift: 15, logisticsDelayMultiplier: 1.2, demandSpike: 45 });
    } else if (scenario === "Conservative") {
      setLocalVars({ materialCostShift: -5, logisticsDelayMultiplier: 0.9, demandSpike: -10 });
    }
    // Commit changes will be called manually or via a separate useEffect if needed
    // But let's just commit immediately here
    setTimeout(() => {
      setVariable("materialCostShift", localVars.materialCostShift); // will use old localVars if we do this
      // Better:
      const newVars =
        scenario === "Baseline"
          ? { materialCostShift: 0, logisticsDelayMultiplier: 1.0, demandSpike: 0 }
          : scenario === "Aggressive"
            ? { materialCostShift: 15, logisticsDelayMultiplier: 1.2, demandSpike: 45 }
            : { materialCostShift: -5, logisticsDelayMultiplier: 0.9, demandSpike: -10 };

      setVariable("materialCostShift", newVars.materialCostShift);
      setVariable("logisticsDelayMultiplier", newVars.logisticsDelayMultiplier);
      setVariable("demandSpike", newVars.demandSpike);
      generateForecast();
    }, 0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Simulation Parameters
        </h2>
        <button
          onClick={commitChanges}
          className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Sync Engine
        </button>
      </div>

      {/* Scenario Presets */}
      <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5 mb-8">
        {scenarios.map((s: any) => (
          <button
            key={s.id}
            onClick={() => handleScenarioChange(s.id)}
            className={`flex-1 flex flex-col items-center justify-center p-2 rounded-md transition-all ${
              activeScenario === s.id
                ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <span
              className={`text-sm font-bold ${activeScenario === s.id ? "text-primary" : "text-slate-400"}`}
            >
              {s.label}
            </span>
            <span className="text-[10px] text-slate-500 hidden xl:block mt-1">{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-8 flex-1">
        {/* Material Cost Shift */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <label className="text-sm font-bold text-slate-300">Material Cost Variance</label>
              <p className="text-[10px] text-slate-500">Projected shifts in raw material pricing</p>
            </div>
            <span
              className={`text-lg font-mono font-bold ${localVars.materialCostShift > 0 ? "text-red-400" : localVars.materialCostShift < 0 ? "text-emerald-400" : "text-slate-400"}`}
            >
              {localVars.materialCostShift > 0 ? "+" : ""}
              {localVars.materialCostShift}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={localVars.materialCostShift}
            onMouseDown={() => setIsDragging(true)}
            onChange={(e) =>
              setLocalVars({ ...localVars, materialCostShift: Number(e.target.value) })
            }
            onMouseUp={commitChanges}
            onTouchEnd={commitChanges}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Logistics Delay Multiplier */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <label className="text-sm font-bold text-slate-300">Global Logistics Friction</label>
              <p className="text-[10px] text-slate-500">
                Port congestion and route disruption multiplier
              </p>
            </div>
            <span
              className={`text-lg font-mono font-bold ${localVars.logisticsDelayMultiplier > 1.2 ? "text-amber-400" : "text-slate-400"}`}
            >
              {localVars.logisticsDelayMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={localVars.logisticsDelayMultiplier}
            onMouseDown={() => setIsDragging(true)}
            onChange={(e) =>
              setLocalVars({ ...localVars, logisticsDelayMultiplier: Number(e.target.value) })
            }
            onMouseUp={commitChanges}
            onTouchEnd={commitChanges}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Demand Spike */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <label className="text-sm font-bold text-slate-300">Market Demand Shock</label>
              <p className="text-[10px] text-slate-500">
                Sudden shifts in consumer/industrial demand
              </p>
            </div>
            <span
              className={`text-lg font-mono font-bold ${localVars.demandSpike > 20 ? "text-emerald-400" : localVars.demandSpike < 0 ? "text-red-400" : "text-slate-400"}`}
            >
              {localVars.demandSpike > 0 ? "+" : ""}
              {localVars.demandSpike}%
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="100"
            step="5"
            value={localVars.demandSpike}
            onMouseDown={() => setIsDragging(true)}
            onChange={(e) => setLocalVars({ ...localVars, demandSpike: Number(e.target.value) })}
            onMouseUp={commitChanges}
            onTouchEnd={commitChanges}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Warning Alert if high risk */}
      {(localVars.materialCostShift > 30 || localVars.logisticsDelayMultiplier > 2.0) && (
        <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-1">High Risk Threshold</h4>
            <p className="text-xs text-red-400/80">
              These parameters exceed historical stress-test boundaries. Margin collapse probability
              is extremely high.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
