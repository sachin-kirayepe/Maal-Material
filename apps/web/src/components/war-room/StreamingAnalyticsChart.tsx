"use client";

import React, { useMemo } from "react";
import { useLiveOrchestratorStore } from "../../store/live-orchestration-state";
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
const ResponsiveContainer = RechartsResponsiveContainer as any;
const AreaChart = RechartsAreaChart as any;
const Area = RechartsArea as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
import { Activity as ActivityIcon } from "lucide-react";
const Activity = ActivityIcon as any;

export function StreamingAnalyticsChart() {
  const { metricsStream } = useLiveOrchestratorStore();

  // Memoize data to prevent unnecessary re-renders of the chart component internals if possible
  const data = useMemo(() => metricsStream, [metricsStream]);

  return (
    <div className="glass-panel p-6 rounded-2xl relative h-[400px] flex flex-col group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary animate-pulse-cyan" />
          <h3 className="text-lg font-bold text-white tracking-widest uppercase">
            Cluster Utilization Topology
          </h3>
        </div>
        <div className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
          LIVE STREAM (60FPS)
        </div>
      </div>

      <div className="flex-1 relative z-10 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(0, 255, 255, 0.2)",
                borderRadius: "8px",
              }}
              itemStyle={{ fontFamily: "monospace", fontSize: "12px" }}
              labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px", fontSize: "10px" }}
            />
            <Area
              type="monotone"
              dataKey="cpuLoad"
              name="CPU Load (%)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCpu)"
              isAnimationActive={false} // Disable recharts animation for better performance on streaming data
            />
            <Area
              type="monotone"
              dataKey="networkLatency"
              name="Latency (ms)"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLatency)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
