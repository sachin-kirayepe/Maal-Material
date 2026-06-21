"use client";

import React, { useEffect, useState } from "react";
import { usePlanetaryTelemetryStore } from "../../store/planetary-telemetry-store";
import {
  Globe2 as Globe2Icon,
  WifiOff as WifiOffIcon,
  AlertTriangle as AlertTriangleIcon,
  Wifi as WifiIcon,
  Activity as ActivityIcon,
} from "lucide-react";
const Globe2 = Globe2Icon as any;
const WifiOff = WifiOffIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const Wifi = WifiIcon as any;
const Activity = ActivityIcon as any;

export function GlobalTelemetryHUD() {
  const { nodes, activeRegion, isGlobalSyncActive } = usePlanetaryTelemetryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeNode = nodes[activeRegion];
  if (!activeNode) return null;

  const isDegraded = activeNode.status === "DEGRADED";
  const isOffline = activeNode.status === "OFFLINE";

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-full">
      {/* Region Indicator */}
      <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
        <Globe2 className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
          {activeNode.id}
        </span>
      </div>

      {/* Latency & Status */}
      <div className="flex items-center gap-2">
        {isOffline ? (
          <WifiOff className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        ) : isDegraded ? (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        )}

        <span
          className={`text-[10px] font-mono font-bold w-10 ${
            isOffline ? "text-rose-500" : isDegraded ? "text-amber-500" : "text-emerald-400"
          }`}
        >
          {isOffline ? "ERR" : `${activeNode.latencyMs}ms`}
        </span>
      </div>

      {/* Global Sync Indicator */}
      <div
        className="flex items-center gap-1.5 pl-3 border-l border-slate-800"
        title="Planetary Sync Heartbeat"
      >
        <Activity
          className={`w-3.5 h-3.5 ${isGlobalSyncActive ? "text-primary" : "text-slate-600"}`}
        />
        <div
          className={`w-2 h-2 rounded-full ${
            isGlobalSyncActive
              ? "bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)] animate-pulse"
              : "bg-slate-700"
          }`}
        />
      </div>
    </div>
  );
}
