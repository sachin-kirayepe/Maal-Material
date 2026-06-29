"use client";

import React from "react";
import { Coffee, ArrowRight, Lightbulb, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import { useInsightsStore } from "@/stores/insightsStore";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DailyInsights() {
  const { aiInsights, operationalAlerts, isLoading, fetchAiInsights, fetchOperationalAlerts } = useInsightsStore();

  React.useEffect(() => {
    fetchAiInsights();
    fetchOperationalAlerts();
  }, [fetchAiInsights, fetchOperationalAlerts]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Coffee className="text-amber-500" size={28} /> Daily Executive Insights
          </h1>
          <p className="text-zinc-400">Your AI-generated morning digest summarizing platform health, risks, and opportunities.</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-white">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p className="text-sm text-zinc-500">Prepared dynamically</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <Sparkles className="text-amber-500 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-medium text-amber-500 mb-2">Good Morning, Chief!</h2>
              <p className="text-zinc-300 leading-relaxed">
                {isLoading ? "Analyzing your platform data..." : aiInsights.length === 0 && operationalAlerts.length === 0 ? "You're all caught up. No new alerts or insights to report." : `You have ${operationalAlerts.length} operational alerts and ${aiInsights.length} actionable insights to review today.`}
              </p>
            </div>
          </div>
        </div>

        {/* The Insights Feed */}
        <div className="space-y-4">
          {isLoading ? (
             <div className="text-center text-zinc-500 p-8">Loading insights...</div>
          ) : aiInsights.length === 0 && operationalAlerts.length === 0 ? (
             <EmptyState icon={Coffee} title="No New Insights" description="Check back later for AI-generated operational and financial insights." />
          ) : (
             <>
               {operationalAlerts.map((alert: any, i: number) => (
                 <div key={`alert-${i}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6">
                   <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
                     <ShieldAlert className="text-red-500" size={20} />
                   </div>
                   <div>
                     <h3 className="text-lg font-medium text-white mb-2">{alert.title || "Alert"}</h3>
                     <p className="text-sm text-zinc-400 mb-4">{alert.description || alert.message || "Action required."}</p>
                   </div>
                 </div>
               ))}
               
               {aiInsights.map((insight: any, i: number) => (
                 <div key={`insight-${i}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6">
                   <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center shrink-0 border border-green-500/20">
                     <Lightbulb className="text-green-500" size={20} />
                   </div>
                   <div>
                     <h3 className="text-lg font-medium text-white mb-2">{insight.title || "AI Insight"}</h3>
                     <p className="text-sm text-zinc-400 mb-4">{insight.description || insight.message || "Optimization opportunity detected."}</p>
                   </div>
                 </div>
               ))}
             </>
          )}
        </div>

      </div>
    </div>
  );
}
