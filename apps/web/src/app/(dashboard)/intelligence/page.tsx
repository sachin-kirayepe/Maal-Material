"use client";

import React, { useState } from "react";
import { BrainCircuit, Settings2, Activity, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAutomationStore } from "@/stores/automationStore";
import { useTenantId } from "@/hooks/useTenantId";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function BusinessIntelligence() {
  const tenantId = useTenantId();
  const { workflows, isLoading, fetchWorkflows, toggleWorkflow } = useAutomationStore();

  const [localSettings, setLocalSettings] = useState({
    autoPO: false,
    smartRouting: false,
    fraudBlock: false,
    dynamicPricing: false,
  });

  React.useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows, tenantId]);

  const handleToggle = async (key: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setLocalSettings(prev => ({ ...prev, [key]: newValue }));
  };

  // Extract recent decisions from workflows or show empty state if none
  const decisions = workflows.flatMap((w: any) => w.recentActions || []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="text-purple-500" size={28} /> AI Control Center
          </h1>
          <p className="text-zinc-400">Configure autonomous agents and monitor AI decisions across your supply chain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30 flex justify-between items-center">
              <h3 className="font-medium text-lg flex items-center gap-2"><Settings2 size={20}/> Agent Configuration</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autonomous Procurement</p>
                  <p className="text-sm text-zinc-400 mt-1">Automatically draft and approve POs for low-value recurring items.</p>
                </div>
                <button 
                  onClick={() => handleToggle("autoPO", localSettings.autoPO)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.autoPO ? 'bg-purple-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${localSettings.autoPO ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Smart Logistics Routing</p>
                  <p className="text-sm text-zinc-400 mt-1">AI redirects trucks mid-transit based on traffic and weather data.</p>
                </div>
                <button 
                  onClick={() => handleToggle("smartRouting", localSettings.smartRouting)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.smartRouting ? 'bg-purple-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${localSettings.smartRouting ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Proactive Fraud Blocking</p>
                  <p className="text-sm text-zinc-400 mt-1">Automatically freeze payments if an anomaly score exceeds 90%.</p>
                </div>
                <button 
                  onClick={() => handleToggle("fraudBlock", localSettings.fraudBlock)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.fraudBlock ? 'bg-purple-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${localSettings.fraudBlock ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Action Log View */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-black/30">
            <h3 className="font-medium text-lg">Recent AI Decisions</h3>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {isLoading ? (
              <>
                <SkeletonCard className="p-4" />
                <SkeletonCard className="p-4" />
              </>
            ) : decisions.length === 0 ? (
              <EmptyState 
                icon={Activity} 
                title="No AI Decisions Yet" 
                description="The intelligence engine is monitoring operations. Autonomous actions will appear here."
              />
            ) : (
              decisions.map((decision: any, idx: number) => (
                <div key={idx} className="bg-black border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                    <BrainCircuit size={14}/> {decision.type || "Autonomous Action"}
                  </div>
                  <p className="text-sm font-medium text-white">{decision.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">{decision.description}</p>
                  <p className="text-[10px] text-zinc-600 mt-2">{new Date(decision.timestamp || Date.now()).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
