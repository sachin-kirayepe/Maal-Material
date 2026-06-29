"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Package, Users, Activity, DownloadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useAnalyticsStore } from "@/stores/analyticsStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function AnalyticsDashboard() {
  const tenantId = useTenantId();
  const { overview, isLoading, fetchOverview, fetchTrends } = useAnalyticsStore();

  useEffect(() => {
    fetchOverview(tenantId);
    fetchTrends("procurement", 30, tenantId);
  }, [fetchOverview, fetchTrends]);

  const handleExport = async () => {
    try {
      toast.info("Queueing analytics export...");
      await ApiClient.post("/reports/generate", { templateId: "analytics-report", tenantId: tenantId });
      toast.success("Job Queued: You will be notified when the export is ready.");
    } catch (e) {
      toast.error("Failed to queue export job.");
    }
  };

  const kpis = [
    { title: "Total Spend", value: overview?.totalSpend || "0", trend: overview?.spendTrend || "0%", icon: <DollarSign className="text-green-400" size={24}/>, up: true },
    { title: "Material Procured", value: overview?.totalProcured || "0 MT", trend: overview?.procuredTrend || "0%", icon: <Package className="text-blue-400" size={24}/>, up: true },
    { title: "Active Suppliers", value: overview?.activeSuppliers || "0", trend: overview?.supplierTrend || "0%", icon: <Users className="text-amber-400" size={24}/>, up: false },
    { title: "System Uptime", value: overview?.uptime || "0%", trend: overview?.uptimeTrend || "Optimal", icon: <Activity className="text-purple-400" size={24}/>, up: true },
  ];
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BarChart3 className="text-purple-500" size={28} /> Business Intelligence
          </h1>
          <p className="text-zinc-400">Enterprise-wide analytics, procurement spends, and operational metrics.</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-white">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors active:scale-95">
            <DownloadCloud size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Top Level KPIs */}
      {isLoading && !overview ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">{stat.icon}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mb-1">{stat.title}</p>
                <h3 className="text-3xl font-medium">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Monthly Procurement Spend</h3>
            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
              <TrendingUp size={12} /> +15% vs Last Year
            </span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 pt-10 border-b border-zinc-800 pb-2">
            {(overview?.monthlySpend || []).map((height: number, i: number) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: i * 0.05, duration: 0.8 }}
                  className="w-full bg-purple-500/20 group-hover:bg-purple-500 rounded-t-sm transition-colors relative"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {height}L
                  </span>
                </motion.div>
                <span className="text-[10px] text-zinc-600 uppercase">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i] || 'M'}
                </span>
              </div>
            ))}
            {(!overview?.monthlySpend || overview.monthlySpend.length === 0) && (
              <div className="w-full text-center text-sm text-zinc-500 pb-10">No spend data available for this period.</div>
            )}
          </div>
        </div>


        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium mb-6">Spend by Category</h3>
          <div className="space-y-6">
            {(overview?.categories || []).map((cat: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-zinc-400">{cat.name || 'Unknown'}</span>
                  <span className="text-sm font-medium">{cat.percent || 0}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${cat.percent || 0}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`h-full ${cat.color || 'bg-purple-500'} rounded-full`}
                  />
                </div>
              </div>
            ))}
            {(!overview?.categories || overview.categories.length === 0) && (
              <div className="text-sm text-zinc-500 text-center py-4">No category distribution data available.</div>
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              View Detailed Breakdown →
            </button>
          </div>
        </div>
      </div>
      </>)}
    </div>
  );
}
