"use client";

import { useCivilizationStore } from "../../store/civilization-state";
import { Activity, Cpu, Network, Thermometer } from "lucide-react";

export function GlobalTelemetryWidget() {
  const { telemetry } = useCivilizationStore();

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Cinematic Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Activity className="w-6 h-6 text-primary animate-pulse-cyan" />
        <h3 className="text-xl font-bold holographic-text tracking-widest">GLOBAL TELEMETRY</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* Network Latency */}
        <div className="bg-background/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold tracking-wider">
            <Network className="w-4 h-4" />
            FABRIC LATENCY
          </div>
          <div className="text-3xl font-mono font-light">
            {telemetry.latency} <span className="text-sm text-primary">ms</span>
          </div>
        </div>

        {/* Packet Loss */}
        <div className="bg-background/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold tracking-wider">
            <Cpu className="w-4 h-4" />
            PACKET LOSS
          </div>
          <div className="text-3xl font-mono font-light">
            {telemetry.packetLoss} <span className="text-sm text-primary">%</span>
          </div>
        </div>

        {/* Thermal Stress */}
        <div className="bg-background/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold tracking-wider">
            <Thermometer className="w-4 h-4" />
            CORE THERMALS
          </div>
          <div className="text-3xl font-mono font-light">
            {telemetry.thermalStress} <span className="text-sm text-primary">ΔT</span>
          </div>
        </div>

        {/* Active Nodes */}
        <div className="bg-background/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold tracking-wider">
            <Activity className="w-4 h-4" />
            ACTIVE NODES
          </div>
          <div className="text-3xl font-mono font-light">
            {(telemetry.activeNodes / 1000).toFixed(1)}
            <span className="text-sm text-primary">k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
