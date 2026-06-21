"use client";

import React, { useState, useEffect } from "react";
import { usePlanetaryTelemetryStore } from "../../store/planetary-telemetry-store";
import {
  WifiOff as WifiOffIcon,
  ShieldAlert as ShieldAlertIcon,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
const WifiOff = WifiOffIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const RefreshCw = RefreshCwIcon as any;

interface EdgeResilientBoundaryProps {
  children: React.ReactNode;
  fallbackMode?: "blur" | "replace" | "banner";
  componentId?: string;
}

export function EdgeResilientBoundary({
  children,
  fallbackMode = "banner",
  componentId = "Unnamed Component",
}: EdgeResilientBoundaryProps) {
  const { nodes, activeRegion } = usePlanetaryTelemetryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  const activeNode = nodes[activeRegion];
  const isOffline = activeNode?.status === "OFFLINE";

  if (!isOffline) {
    return <>{children}</>;
  }

  // Graceful degradation when region is offline
  if (fallbackMode === "replace") {
    return (
      <div className="w-full h-48 bg-slate-900 border border-rose-500/30 rounded-xl flex flex-col items-center justify-center p-6 text-center">
        <WifiOff className="w-8 h-8 text-rose-500 mb-3" />
        <h3 className="text-sm font-bold text-slate-200">Edge Node Unreachable</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {componentId} cannot be rendered because the primary edge node ({activeRegion}) is
          offline. Attempting failover...
        </p>
      </div>
    );
  }

  if (fallbackMode === "blur") {
    return (
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center rounded-xl border border-rose-500/20">
          <div className="bg-slate-900 px-4 py-2 rounded-lg flex items-center gap-3 border border-rose-500/30">
            <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
            <span className="text-xs font-bold text-slate-300">Awaiting edge failover...</span>
          </div>
        </div>
        <div className="opacity-50 select-none pointer-events-none">{children}</div>
      </div>
    );
  }

  // Default 'banner' mode (preserves component but shows a warning)
  return (
    <div className="relative">
      <div className="absolute -top-3 left-4 z-20 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg border border-rose-400">
        <ShieldAlert className="w-3 h-3" />
        STALE CACHE (EDGE OFFLINE)
      </div>
      <div className="opacity-80 ring-1 ring-rose-500/30 rounded-xl">{children}</div>
    </div>
  );
}
