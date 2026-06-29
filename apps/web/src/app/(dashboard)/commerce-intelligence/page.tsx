"use client";

import React from "react";
import { LineChart, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from "lucide-react";
import { useCommerceIntelligenceStore } from "@/stores/commerceIntelligenceStore";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CommerceIntelligence() {
  const { analytics, fetchAnalytics } = useCommerceIntelligenceStore();

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <LineChart className="text-emerald-500" size={28} /> Market Price Trends
          </h1>
          <p className="text-zinc-400">Live analytics and historical charting for commodity prices like Steel, Cement, and Fuel.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition-colors">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Live Tickers */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
        {!analytics?.tickers || analytics.tickers.length === 0 ? (
          <div className="w-full text-zinc-500 text-sm">No live market tickers available.</div>
        ) : (
          analytics.tickers.map((ticker: any, i: number) => (
            <div key={i} className="min-w-[200px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 shrink-0">
              <p className="text-zinc-400 text-xs font-medium mb-2">{ticker.symbol || ticker.name}</p>
              <div className="flex justify-between items-end">
                <p className="text-lg font-medium">{ticker.price || "N/A"}</p>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${ticker.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ticker.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {ticker.change || "0%"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-medium">TMT Rebar Index (National)</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">Live <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span></span>
            </div>
            <div className="flex bg-black border border-zinc-800 rounded-lg p-1 text-xs">
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1W</button>
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1M</button>
              <button className="px-3 py-1 rounded-md bg-zinc-800 text-white">3M</button>
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1Y</button>
            </div>
          </div>

          <div className="h-[400px] w-full relative pt-4 flex items-center justify-center text-zinc-500">
            No chart data available.
          </div>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-500"/> AI Market Insights</h3>
            
            <div className="space-y-4">
              {!analytics?.insights || analytics.insights.length === 0 ? (
                <EmptyState icon={Layers} title="No Insights" description="Market insights will appear here once data is aggregated." />
              ) : (
                analytics.insights.map((insight: any, i: number) => (
                  <div key={i} className="bg-black border border-zinc-800 p-4 rounded-xl">
                    <p className="text-sm font-medium text-white mb-2">{insight.title}</p>
                    <p className="text-xs text-zinc-400">{insight.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
