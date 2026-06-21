"use client";

import React from "react";
import { useLiveOrchestratorStore } from "../../store/live-orchestration-state";
import { Globe2 as Globe2Icon } from "lucide-react";
const Globe2 = Globe2Icon as any;

export function DistributedExecutionMap() {
  const { executionNodes } = useLiveOrchestratorStore();

  const getNodeColor = (status: string) => {
    switch (status) {
      case "HEALTHY":
        return "bg-primary shadow-[0_0_10px_hsl(var(--primary))]";
      case "STRESSED":
        return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]";
      case "OFFLINE":
        return "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden h-[300px] flex flex-col group">
      {/* Background Holographic Grid representing a map */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 scale-150 transition-transform duration-1000 group-hover:scale-[1.55]"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-white tracking-widest uppercase">
            Global Execution Nodes
          </h3>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {/* Mocking a topological node view */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[2/1] border border-white/10 rounded-[100%] overflow-hidden bg-white/5 backdrop-blur-sm">
            {executionNodes.map((node) => {
              // Normalize lat/lng to percentages for a generic oval map representation
              const top = `${((node.lat + 90) / 180) * 100}%`;
              const left = `${((node.lng + 180) / 360) * 100}%`;

              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer"
                  style={{ top, left }}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${getNodeColor(node.status)}`}
                  >
                    {node.status !== "OFFLINE" && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-50 bg-inherit"></div>
                    )}
                  </div>

                  {/* Node Tooltip on Hover */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 p-2 rounded text-[10px] font-mono text-white opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-bold text-primary mb-1">{node.id}</div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">LOAD:</span>
                      <span className={node.workload > 85 ? "text-amber-500" : "text-white"}>
                        {node.workload.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
