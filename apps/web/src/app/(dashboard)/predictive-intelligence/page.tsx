"use client";

import React from "react";
import { ScenarioControlPanel } from "@/components/predictive/ScenarioControlPanel";
import { FutureTrajectoryChart } from "@/components/predictive/FutureTrajectoryChart";
import { StrategicRiskOverlay } from "@/components/predictive/StrategicRiskOverlay";
import { Compass as CompassIcon } from "lucide-react";
const Compass = CompassIcon as any;

export default function PredictiveIntelligencePage() {
  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-primary" />
            Strategic Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Realtime predictive simulation engine and future-intelligence planning.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Col: Controls */}
        <div className="lg:col-span-3">
          <ScenarioControlPanel />
        </div>

        {/* Center/Right Col: Visualization & AI Insights */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex-1 min-h-[400px]">
            <FutureTrajectoryChart />
          </div>
          <div className="h-[250px]">
            <StrategicRiskOverlay />
          </div>
        </div>
      </div>
    </div>
  );
}
