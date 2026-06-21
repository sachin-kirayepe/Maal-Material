import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSystemCommandStore } from "../../stores/systemCommandStore";
import { Server, Activity, Shield, RefreshCw } from "lucide-react";

export default function SystemCommandCenter() {
  const { rules, telemetry, isLoading, fetchSystemStatus, triggerSyncPush } =
    useSystemCommandStore();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success">("idle");

  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  const handleSync = async () => {
    setSyncStatus("syncing");
    const success = await triggerSyncPush([{ type: "DIAGNOSTIC_PING", timestamp: new Date() }]);
    if (success) {
      setSyncStatus("idle");
      toast.success("System sync successful.");
    } else {
      setSyncStatus("idle");
      toast.error("System sync failed.");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Server className="w-8 h-8 mr-3 text-indigo-600" /> System & Universal Hub
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Core infrastructure observability, rules, and offline sync
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncStatus === "syncing"}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
          {syncStatus === "syncing"
            ? "Syncing..."
            : syncStatus === "success"
              ? "Synced!"
              : "Force Sync"}
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Infrastructure Telemetry</h2>
          </div>
          {telemetry ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Fabric ID</span>
                <span className="font-mono font-medium text-gray-900">{telemetry.fabricId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Global Compute Load</span>
                <span className="font-mono font-medium text-blue-600">
                  {(telemetry.globalComputeLoad * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Active Node Count</span>
                <span className="font-mono font-medium text-indigo-600">
                  {telemetry.activeNodeCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Anomaly Index</span>
                <span className="font-mono font-medium text-emerald-600">
                  {telemetry.anomalyIndex}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No telemetry data available. Engine offline.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-rose-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Rules Engine Modules</h2>
          </div>
          {isLoading ? (
            <div className="text-gray-500 text-center py-4">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No active rules loaded in engine.</div>
          ) : (
            <div className="space-y-3">
              {rules.slice(0, 5).map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{rule.name}</div>
                    <div className="text-xs text-gray-500">
                      {rule.module} | {rule.eventTrigger}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
