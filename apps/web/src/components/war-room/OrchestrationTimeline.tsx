"use client";

import React from "react";
import { useLiveOrchestratorStore } from "../../store/live-orchestration-state";
import {
  GitMerge as GitMergeIcon,
  Zap as ZapIcon,
  Cpu as CpuIcon,
  RefreshCw as RefreshCwIcon,
  CheckCircle2 as CheckCircle2Icon,
} from "lucide-react";
const GitMerge = GitMergeIcon as any;
const Zap = ZapIcon as any;
const Cpu = CpuIcon as any;
const RefreshCw = RefreshCwIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;

export function OrchestrationTimeline() {
  const { orchestrationEvents } = useLiveOrchestratorStore();

  const getEventIcon = (type: string, status: string) => {
    if (status === "COMPLETED") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;

    switch (type) {
      case "DISPATCH":
        return <Zap className="w-4 h-4 text-primary" />;
      case "SCALE":
        return <RefreshCw className="w-4 h-4 text-indigo-400" />;
      case "SYNC":
        return <GitMerge className="w-4 h-4 text-blue-400" />;
      case "COMPUTE":
        return <Cpu className="w-4 h-4 text-violet-400" />;
      default:
        return <Zap className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-amber-500 bg-amber-500/10";
      case "ACTIVE":
        return "text-primary bg-primary/10 animate-pulse";
      case "COMPLETED":
        return "text-emerald-500 bg-emerald-500/10";
      case "FAILED":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-white/5";
    }
  };

  return (
    <div className="glass-panel p-0 rounded-2xl relative overflow-hidden flex flex-col h-[300px]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between z-10 bg-background/50 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-primary" />
          Live Orchestration Feed
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">SYNCING</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {orchestrationEvents.slice(0, 20).map((event) => (
            <div
              key={event.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-top-2 duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10">
                {getEventIcon(event.type, event.status)}
              </div>

              {/* Card */}
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-white/5 bg-background/40 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-white tracking-wider">
                    {event.id}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {event.timestamp?.split("T")[1]?.split(".")[0]}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground mb-2">
                  Action: <span className="text-white font-medium">{event.type}</span>
                  <span className="mx-1">→</span>
                  <span className="text-primary font-mono">{event.target}</span>
                </div>

                <div
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${getStatusColor(event.status)}`}
                >
                  {event.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
