"use client";

import React, { useState, useEffect } from "react";
import { useAutonomousEvolutionStore } from "@/store/autonomous-evolution-state";
import {
  Cpu as CpuIcon,
  Activity as ActivityIcon,
  Orbit as OrbitIcon,
  Network as NetworkIcon,
  ShieldCheck as ShieldCheckIcon,
  Zap as ZapIcon,
  ServerCog as ServerCogIcon,
  Dna as DnaIcon,
} from "lucide-react";
const Cpu = CpuIcon as any;
const Activity = ActivityIcon as any;
const Orbit = OrbitIcon as any;
const Network = NetworkIcon as any;
const ShieldCheck = ShieldCheckIcon as any;
const Zap = ZapIcon as any;
const ServerCog = ServerCogIcon as any;
const Dna = DnaIcon as any;

export default function AscensionMatrixPage() {
  const { epoch,
    governanceLevel,
    activeMutations,
    eventLog,
    setGovernanceLevel } = useAutonomousEvolutionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Cinematic Header */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 opacity-10 blur-3xl pointer-events-none">
          <div className="w-96 h-96 bg-primary rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
            <Orbit className="w-3 h-3 animate-[spin_10s_linear_infinite]" />
            Maal-Material Meta-Core
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Ascension Matrix</h1>
          <p className="text-slate-400 max-w-xl">
            The central nervous system of the Self-Evolving Enterprise. Monitor autonomous
            optimizations, predictive scaling, and civilization-grade economic adaptations.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-w-[120px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
              Epoch
            </p>
            <p className="text-3xl font-mono font-bold text-white">{epoch.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-w-[120px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
              Mutations
            </p>
            <p className="text-3xl font-mono font-bold text-primary">{activeMutations}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Governance Control Panel */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
              <ServerCog className="w-24 h-24 text-white" />
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Dna className="w-5 h-5 text-emerald-400" />
              Evolutionary Parameters
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-slate-400 mb-2">
                Adjust the autonomy constraints of the central intelligence.
              </p>

              {(["CONSERVATIVE", "BALANCED", "AGGRESSIVE"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setGovernanceLevel(level)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    governanceLevel === level
                      ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        governanceLevel === level
                          ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                          : "bg-slate-700"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-bold ${governanceLevel === level ? "text-white" : "text-slate-400"}`}
                    >
                      {level}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {level === "CONSERVATIVE"
                      ? "Low Mutability"
                      : level === "BALANCED"
                        ? "Standard Evolution"
                        : "Unconstrained"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <button
                onClick={() => {}}
                className="w-full py-3 bg-slate-950 border border-primary/30 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Force Evolution Cycle
              </button>
            </div>
          </div>
        </div>

        {/* Autonomous Action Ledger */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                Autonomous Action Ledger
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Feed
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-h-[600px] space-y-4">
              {eventLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <ShieldCheck className="w-12 h-12 mb-4" />
                  <p>Awaiting autonomous events...</p>
                </div>
              ) : (
                eventLog.map((evt, idx) => {
                  const getIcon = () => {
                    switch (evt.type) {
                      case "SECURITY":
                        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
                      case "OPTIMIZATION":
                        return <Zap className="w-5 h-5 text-amber-400" />;
                      case "ECONOMIC_SHIFT":
                        return <Activity className="w-5 h-5 text-indigo-400" />;
                      case "SELF_HEAL":
                        return <Cpu className="w-5 h-5 text-primary" />;
                    }
                  };

                  return (
                    <div
                      key={evt.id}
                      className={`p-4 rounded-xl border transition-all ${
                        idx === 0
                          ? "bg-slate-800/50 border-slate-700 shadow-lg"
                          : "bg-slate-950 border-slate-800 opacity-80"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          {getIcon()}
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                            {evt.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 mb-3 ml-8 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="ml-8 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          Result: {evt.impact}
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          Resolved in {evt.resolvedTimeMs}ms
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
