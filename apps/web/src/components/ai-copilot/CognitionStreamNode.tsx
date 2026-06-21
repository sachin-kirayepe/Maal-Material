import React from "react";
import { Cpu as CpuIcon, CheckCircle2 as CheckCircle2Icon } from "lucide-react";
const Cpu = CpuIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;

interface CognitionStreamNodeProps {
  steps: string[];
  isStreaming: boolean;
}

export function CognitionStreamNode({ steps, isStreaming }: CognitionStreamNodeProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mb-4 pl-4 border-l-2 border-primary/20 space-y-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground animate-in fade-in slide-in-from-left-2">
      <div className="flex items-center gap-2 mb-2 text-primary">
        <Cpu className={`w-3 h-3 ${isStreaming ? "animate-pulse" : ""}`} />
        <span>Enterprise Cognition Core</span>
      </div>

      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isActive = isLast && isStreaming;

        return (
          <div
            key={idx}
            className={`flex items-start gap-2 ${isActive ? "text-white animate-pulse" : "opacity-60"}`}
          >
            <span className="mt-0.5">
              {isActive ? (
                <span className="w-2 h-2 rounded-full border border-primary border-t-transparent animate-spin inline-block" />
              ) : (
                <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
              )}
            </span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
