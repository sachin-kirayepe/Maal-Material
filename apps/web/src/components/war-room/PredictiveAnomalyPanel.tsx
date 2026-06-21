"use client";

import React from "react";
import { useLiveOrchestratorStore } from "../../store/live-orchestration-state";
import {
  ShieldAlert as ShieldAlertIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
} from "lucide-react";
const ShieldAlert = ShieldAlertIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const Info = InfoIcon as any;

export function PredictiveAnomalyPanel() {
  const { anomalies } = useLiveOrchestratorStore();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-destructive bg-destructive/10 border-destructive/30";
      case "WARNING":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "INFO":
        return "text-primary bg-primary/10 border-primary/30";
      default:
        return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <ShieldAlert className="w-4 h-4" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4" />;
      case "INFO":
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-0 rounded-2xl relative overflow-hidden flex flex-col h-[300px]">
      <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between z-10">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
          Predictive Intelligence
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">AI COGNITION ACTIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {anomalies.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-mono opacity-50">
            NO ANOMALIES DETECTED
          </div>
        ) : (
          anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`p-3 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-right-4 duration-500 ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="mt-0.5">{getSeverityIcon(anomaly.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                    {anomaly.severity}
                  </span>
                  <span className="text-[9px] font-mono opacity-60">
                    {anomaly.timestamp?.split("T")[1]?.split(".")[0]}
                  </span>
                </div>
                <p className="text-xs font-medium mb-1">{anomaly.message}</p>
                <div className="text-[10px] font-mono opacity-60 flex items-center gap-2">
                  <span>NODE:</span>
                  <span className="font-bold">{anomaly.node}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scanline */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-20"
        style={{
          backgroundImage: "linear-gradient(transparent 50%, rgba(255,255,255,1) 50%)",
          backgroundSize: "100% 4px",
        }}
      ></div>
    </div>
  );
}
