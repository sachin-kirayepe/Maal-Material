"use client";

import React, { useState, useEffect } from "react";
import { usePlanetaryTelemetryStore } from "@/store/planetary-telemetry-store";
import {
  Globe2 as Globe2Icon,
  Activity as ActivityIcon,
  ShieldAlert as ShieldAlertIcon,
  Cpu as CpuIcon,
  Network as NetworkIcon,
  Zap as ZapIcon,
  WifiOff as WifiOffIcon,
} from "lucide-react";
const Globe2 = Globe2Icon as any;
const Activity = ActivityIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const Cpu = CpuIcon as any;
const Network = NetworkIcon as any;
const Zap = ZapIcon as any;
const WifiOff = WifiOffIcon as any;
import { EdgeResilientBoundary } from "@/components/infrastructure/EdgeResilientBoundary";

export default function CivilizationCommandPage() {
  const { nodes, activeRegion, simulateOutage, resolveOutage } = usePlanetaryTelemetryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const store = usePlanetaryTelemetryStore.getState() as any;
    store.fetchTelemetryData();
    // const interval = setInterval(() => {
      store.fetchTelemetryData();
    // // }, timer); // Fixed by cleanup
    // return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const totalConnections = Object.values(nodes)
    .filter((n) => n.status !== "OFFLINE")
    .reduce((acc, curr) => acc + curr.activeConnections, 0);

  const globalHealth = Object.values(nodes).every((n) => n.status === "OPERATIONAL")
    ? "OPTIMAL"
    : Object.values(nodes).some((n) => n.status === "OFFLINE")
      ? "CRITICAL"
      : "DEGRADED";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <Globe2 className="w-8 h-8 text-primary" />
            Civilization Command
          </h1>
          <p className="text-slate-400 mt-1">
            Planetary-Scale Enterprise Network Operations Center
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-lg border ${
              globalHealth === "OPTIMAL"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : globalHealth === "DEGRADED"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-500"
            } flex items-center gap-2 font-bold text-sm tracking-widest uppercase`}
          >
            {globalHealth === "CRITICAL" ? (
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            SYSTEM {globalHealth}
          </div>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Network className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
            Global Concurrency
          </p>
          <div className="text-4xl font-bold text-white">{totalConnections.toLocaleString()}</div>
          <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
            <Activity className="w-3 h-3" /> 14.2M req/sec
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
            Active Regions
          </p>
          <div className="text-4xl font-bold text-white">{Object.keys(nodes).length}</div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Distributed execution layer</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
            Primary Node
          </p>
          <div className="text-4xl font-bold text-white tracking-tighter">{activeRegion}</div>
          <p className="text-xs text-primary mt-2 font-mono">
            Latency: {nodes[activeRegion]?.latencyMs || 0}ms
          </p>
        </div>
      </div>

      {/* Node Map Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Planetary Edge Network
          </h2>
          <span className="text-xs text-slate-500 font-mono">Real-time Telemetry Active</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.values(nodes).map((node) => (
            <div
              key={node.id}
              className={`border rounded-lg p-4 transition-all duration-300 ${
                node.status === "OFFLINE"
                  ? "bg-rose-950/20 border-rose-500/30"
                  : node.status === "DEGRADED"
                    ? "bg-amber-950/20 border-amber-500/30"
                    : "bg-slate-950/50 border-slate-800"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {node.id}
                    {node.id === activeRegion && (
                      <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{node.region}</p>
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                    node.status === "OFFLINE"
                      ? "bg-rose-500/20 text-rose-500"
                      : node.status === "DEGRADED"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {node.status}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Latency</span>
                    <span
                      className={node.status === "OFFLINE" ? "text-rose-500" : "text-slate-300"}
                    >
                      {node.status === "OFFLINE" ? "ERR" : `${node.latencyMs}ms`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${node.status === "OFFLINE" ? "bg-rose-500" : node.latencyMs > 100 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{
                        width:
                          node.status === "OFFLINE"
                            ? "100%"
                            : `${Math.min(100, (node.latencyMs / 300) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Connections</span>
                    <span className="text-slate-300">
                      {node.activeConnections.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (node.activeConnections / 40000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="pt-3 mt-3 border-t border-slate-800/50 flex justify-end">
                  {node.status === "OFFLINE" ? (
                    <button
                      onClick={() => resolveOutage(node.id)}
                      className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded transition-colors font-bold flex items-center gap-1"
                    >
                      Restore Edge Node
                    </button>
                  ) : (
                    <button
                      onClick={() => simulateOutage(node.id)}
                      className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-3 py-1.5 rounded transition-colors font-bold flex items-center gap-1"
                    >
                      <WifiOff className="w-3 h-3" /> Simulate Outage
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demonstration of Edge Resilience Wrapper */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Edge Resilience Demonstration</h2>
        <p className="text-sm text-slate-400 mb-6">
          The component below is wrapped in an `EdgeResilientBoundary`. If you simulate an outage on
          your currently assigned active edge node (
          <span className="font-bold text-primary">{activeRegion}</span>), the boundary will
          intercept the simulated network failure and gracefully degrade the UI without crashing the
          application.
        </p>

        <EdgeResilientBoundary componentId="Global Orchestration Engine" fallbackMode="replace">
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-6 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                <Globe2 className="w-6 h-6 text-emerald-400 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400">
                  Global Orchestration Engine: Connected
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">
                  Routing through high-speed edge tier ({activeRegion})
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Uplink Active
            </div>
          </div>
        </EdgeResilientBoundary>
      </div>
    </div>
  );
}
