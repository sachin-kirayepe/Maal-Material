"use client";

import React, { useEffect, useState } from "react";
import { useAutonomousEvolutionStore } from "../../store/autonomous-evolution-state";
import {
  Cpu as CpuIcon,
  ShieldCheck as ShieldCheckIcon,
  Zap as ZapIcon,
  BarChart4 as BarChart4Icon,
  X as XIcon,
} from "lucide-react";
const Cpu = CpuIcon as any;
const ShieldCheck = ShieldCheckIcon as any;
const Zap = ZapIcon as any;
const BarChart4 = BarChart4Icon as any;
const X = XIcon as any;

export function SelfHealingOverlay() {
  const { isGlobalOverlayActive, currentOverlayEvent, clearOverlay } =
    useAutonomousEvolutionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isGlobalOverlayActive || !currentOverlayEvent) return null;

  const getIcon = () => {
    switch (currentOverlayEvent.type) {
      case "SECURITY":
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case "OPTIMIZATION":
        return <Zap className="w-6 h-6 text-amber-400" />;
      case "ECONOMIC_SHIFT":
        return <BarChart4 className="w-6 h-6 text-indigo-400" />;
      case "SELF_HEAL":
        return <Cpu className="w-6 h-6 text-primary" />;
    }
  };

  const getGlowColor = () => {
    switch (currentOverlayEvent.type) {
      case "SECURITY":
        return "shadow-[0_0_30px_rgba(16,185,129,0.2)] border-emerald-500/30";
      case "OPTIMIZATION":
        return "shadow-[0_0_30px_rgba(245,158,11,0.2)] border-amber-500/30";
      case "ECONOMIC_SHIFT":
        return "shadow-[0_0_30px_rgba(99,102,241,0.2)] border-indigo-500/30";
      case "SELF_HEAL":
        return "shadow-[0_0_30px_rgba(14,165,233,0.2)] border-primary/30";
    }
  };

  return (
    <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-none">
      <div
        className={`bg-slate-950/90 backdrop-blur-xl border rounded-2xl p-4 w-96 flex gap-4 ${getGlowColor()} pointer-events-auto`}
      >
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              Autonomous Action
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h4>
            <button
              onClick={clearOverlay}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-medium mb-3">
            {currentOverlayEvent.description}
          </p>

          <div className="flex items-center justify-between border-t border-slate-800/50 pt-2">
            <div className="text-[10px] font-mono text-slate-500">ID: {currentOverlayEvent.id}</div>
            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {currentOverlayEvent.impact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
