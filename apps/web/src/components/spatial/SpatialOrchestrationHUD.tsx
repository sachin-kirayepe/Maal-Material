import React from "react";
import { useSpatialStore, SimulationMode } from "../../store/spatial-state";
import {
  Layers as LayersIcon,
  Thermometer as ThermometerIcon,
  Activity as ActivityIcon,
  Eye as EyeIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Target as TargetIcon,
} from "lucide-react";
const Layers = LayersIcon as any;
const Thermometer = ThermometerIcon as any;
const Activity = ActivityIcon as any;
const Eye = EyeIcon as any;
const Play = PlayIcon as any;
const Pause = PauseIcon as any;
const Target = TargetIcon as any;

export function SpatialOrchestrationHUD() {
  const {
    simulationMode,
    setSimulationMode,
    isSimulationRunning,
    toggleSimulation,
    setCameraTarget,
    selectedNodeId,
    nodes,
    setSelectedNodeId,
  } = useSpatialStore();

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  const modes: { id: SimulationMode; label: string; icon: React.ReactNode }[] = [
    { id: "standard", label: "Standard", icon: <Eye className="w-4 h-4" /> },
    { id: "heatmap", label: "Thermal", icon: <Thermometer className="w-4 h-4" /> },
    { id: "predictive", label: "Load Prediction", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar: Controls */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-2 rounded-xl flex items-center gap-2 shadow-2xl">
          <div className="px-3 border-r border-white/10 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-white tracking-widest uppercase">
              Digital Twin
            </span>
          </div>
          <div className="flex bg-white/5 rounded-lg p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSimulationMode(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  simulationMode === m.id
                    ? "bg-primary text-black shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all shadow-xl ${
            isSimulationRunning
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-amber-500/20 border-amber-500/50 text-amber-400"
          }`}
        >
          {isSimulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isSimulationRunning ? "Simulation Active" : "Simulation Paused"}
        </button>
      </div>

      {/* Right Sidebar: Selected Entity */}
      <div className="self-end pointer-events-auto w-80">
        {selectedNode ? (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-primary/30 rounded-xl p-5 shadow-[0_0_30px_rgba(14,165,233,0.15)] animate-in slide-in-from-right duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedNode.metadata.name}</h2>
                <p className="text-xs text-primary font-mono uppercase">{selectedNode.id}</p>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Status</div>
                <div
                  className={`text-sm font-bold uppercase ${
                    selectedNode.status === "optimal"
                      ? "text-emerald-400"
                      : selectedNode.status === "critical"
                        ? "text-red-400"
                        : "text-amber-400"
                  }`}
                >
                  {selectedNode.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-slate-400 mb-1">Temperature</div>
                  <div className="text-lg font-mono text-white">{selectedNode.temperature}°C</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-slate-400 mb-1">Load %</div>
                  <div className="text-lg font-mono text-white">{selectedNode.loadPercentage}%</div>
                </div>
              </div>

              <button
                onClick={() => setCameraTarget(selectedNode.position)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 py-2 rounded-lg text-xs font-bold transition-colors"
              >
                <Target className="w-4 h-4" /> Focus Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center text-slate-500 text-sm">
            Select a node in the 3D view to inspect telemetry.
          </div>
        )}
      </div>
    </div>
  );
}
