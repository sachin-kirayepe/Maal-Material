"use client";

import React, { useState, useEffect } from "react";
import { useWebsocketStream } from "../../hooks/useWebsocketStream";

// Phase 38 Components
import { GlobalTelemetryWidget } from "../../components/executive/GlobalTelemetryWidget";
import { FleetDispatchCommandPanel } from "../../components/executive/FleetDispatchCommandPanel";
import { M2MEconomyLedgerFeed } from "../../components/executive/M2MEconomyLedgerFeed";

// Phase 39 Components
import { StreamingAnalyticsChart } from "../../components/war-room/StreamingAnalyticsChart";
import { PredictiveAnomalyPanel } from "../../components/war-room/PredictiveAnomalyPanel";
import { DistributedExecutionMap } from "../../components/war-room/DistributedExecutionMap";
import { OrchestrationTimeline } from "../../components/war-room/OrchestrationTimeline";

// Phase 2: Advanced Interactive Charts
import { GradientAreaChart } from "../../components/ui/GradientAreaChart";
import { DonutChart } from "../../components/ui/DonutChart";

import { ApiClient } from "../../lib/api-client";

import { useWebsocketStore } from "../../stores/websocketStore";
import { toast } from "sonner";

export default function OverviewPage() {
  const [telemetryTime, setTelemetryTime] = useState<string>("");
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [segmentData, setSegmentData] = useState<any[]>([]);
  const { isConnected, metrics, notifications } = useWebsocketStore();

  // Initialize high-frequency websocket stream
  useWebsocketStream();

  useEffect(() => {
    // We can use the metrics timestamp if available, otherwise fallback to local time
    if (metrics?.timestamp) {
      setTelemetryTime(new Date(metrics.timestamp).toLocaleTimeString());
    } else {
      setTelemetryTime(new Date().toLocaleTimeString());
    }
  }, [metrics]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      toast(latest.title || "New Notification", {
        description: latest.message || "You have a new update",
      });
    }
  }, [notifications]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data: any = await ApiClient.get("/analytics/overview");
        if (data) {
          // Map real overview data to charts
          setRevenueData([
            { name: "Revenue", value: data.revenue || 0 },
            { name: "Expenses", value: data.expenses || 0 },
          ]);
          setSegmentData([
            { name: "Completed Deliveries", value: data.logistics?.completed || 0 },
            { name: "Pending Deliveries", value: data.logistics?.pending || 0 },
          ]);
        }
      } catch (e) {
        console.error("Failed to load analytics", e);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-[2000px] mx-auto min-h-full">
      {/* 1. Command Center Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-widest border border-primary/30">
              GLOBAL COMMAND CENTER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-cyan"></span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase holographic-text">
            Civilization Override
          </h1>
          <p className="text-sm text-muted-foreground">
            Operator Authorization:{" "}
            <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              LEVEL-5 OMNI
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Network Time
            </div>
          </div>
          <div className="text-2xl font-mono font-light text-white">{telemetryTime}</div>
        </div>
      </div>

      {/* 2. Global Telemetry Span */}
      <div className="w-full">
        <GlobalTelemetryWidget />
      </div>

      {/* 3. Streaming Visualization & Intelligence */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: High-freq Chart & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <StreamingAnalyticsChart />

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <OrchestrationTimeline />
            <M2MEconomyLedgerFeed />
          </div>
        </div>

        {/* Right Column: AI Anomalies & Map & Command */}
        <div className="space-y-6">
          <PredictiveAnomalyPanel />
          <DistributedExecutionMap />
          <FleetDispatchCommandPanel />
        </div>
      </div>

      {/* 4. Advanced Interactive Analytics (Phase 2) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-white tracking-widest uppercase">
              Financial Growth (H1)
            </h3>
          </div>
          <GradientAreaChart data={revenueData} color="#10b981" height={300} />
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-white tracking-widest uppercase">
              Market Segments
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <DonutChart data={segmentData} height={250} />
          </div>
        </div>
      </div>
    </div>
  );
}
