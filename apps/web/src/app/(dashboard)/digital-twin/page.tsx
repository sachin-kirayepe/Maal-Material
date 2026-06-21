"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { SpatialOrchestrationHUD } from "@/components/spatial/SpatialOrchestrationHUD";
import { Box as BoxIcon, Activity as ActivityIcon } from "lucide-react";
const Box = BoxIcon as any;
const Activity = ActivityIcon as any;

const WarehouseDigitalTwinComponent = dynamic(
  () => import("@/components/spatial/WarehouseDigitalTwin").then((mod) => mod.WarehouseDigitalTwin),
  { ssr: false },
);
const WarehouseDigitalTwin = WarehouseDigitalTwinComponent as any;

export default function DigitalTwinPage() {
  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Box className="w-8 h-8 text-primary" />
            Digital Twin Command
          </h1>
          <p className="text-muted-foreground mt-1">
            Realtime spatial visualization and operational twin of Sector Alpha.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              Sync Status
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live 60fps
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              Active Nodes
            </span>
            <span className="text-xs font-bold text-white font-mono">1,024</span>
          </div>
        </div>
      </div>

      {/* Main Spatial Container */}
      <div className="flex-1 min-h-[600px] relative rounded-xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.1)]">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
              <Activity className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="font-mono text-xs uppercase tracking-widest">
                Initializing Spatial Engine...
              </p>
            </div>
          }
        >
          <WarehouseDigitalTwin />
        </Suspense>

        <SpatialOrchestrationHUD />
      </div>
    </div>
  );
}
