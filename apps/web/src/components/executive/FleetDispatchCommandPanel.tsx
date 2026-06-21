"use client";

import { useState } from "react";
import { useCivilizationStore } from "../../store/civilization-state";
import { useRealtimeOrchestrator } from "../../hooks/useRealtimeOrchestrator";
import { Send, Crosshair, Zap } from "lucide-react";

export function FleetDispatchCommandPanel() {
  const { orchestrationMode, activeFleets } = useCivilizationStore();
  const { dispatchFleet } = useRealtimeOrchestrator();
  const [fleetName, setFleetName] = useState("OMEGA_SWARM");
  const [mission, setMission] = useState("LOGISTICS_REBALANCING");
  const [units, setUnits] = useState(500);

  const handleDispatch = () => {
    if (orchestrationMode !== "IDLE") return;
    dispatchFleet(fleetName, mission, units);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <div className="flex items-center gap-3 mb-6">
        <Crosshair className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold text-white tracking-widest">TACTICAL COMMAND</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 block">
            FLEET DESIGNATION
          </label>
          <input
            type="text"
            value={fleetName}
            onChange={(e) => setFleetName(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 block">
            STRATEGIC DIRECTIVE
          </label>
          <select
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="LOGISTICS_REBALANCING">LOGISTICS REBALANCING</option>
            <option value="ASSET_RECOVERY">ASSET RECOVERY</option>
            <option value="THERMAL_CONTAINMENT">THERMAL CONTAINMENT</option>
            <option value="PERIMETER_DEFENSE">PERIMETER DEFENSE</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 block">
            AUTONOMOUS UNITS ({units})
          </label>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <button
          onClick={handleDispatch}
          disabled={orchestrationMode !== "IDLE"}
          className={`w-full mt-4 flex items-center justify-center gap-2 p-4 rounded-xl font-bold tracking-widest transition-all ${
            orchestrationMode === "IDLE"
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          {orchestrationMode === "DISPATCHING" ? (
            <>
              <Zap className="w-5 h-5 animate-pulse" />
              AUTHORIZING...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              AUTHORIZE DISPATCH
            </>
          )}
        </button>

        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="text-xs text-muted-foreground font-semibold tracking-wider mb-3">
            ACTIVE SWARMS
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFleets.map((f) => (
              <span
                key={f}
                className="text-xs font-mono bg-white/5 border border-white/10 text-primary px-2 py-1 rounded"
              >
                [{f}]
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
