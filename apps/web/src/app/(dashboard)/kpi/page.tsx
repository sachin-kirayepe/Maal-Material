"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Plus, Edit2 } from "lucide-react";

import { useAnalyticsStore } from "../../../stores/analyticsStore";

export default function KPISetter() {
  const { trends: kpis, isLoading, fetchTrends } = useAnalyticsStore();

  React.useEffect(() => {
    fetchTrends("kpi-goals");
  }, [fetchTrends]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Target className="text-pink-500" size={28} /> Custom KPI Target Setter
          </h1>
          <p className="text-zinc-400">Define corporate goals, set thresholds, and track real-time progress across all modules.</p>
        </div>
        <button className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-500 transition-colors">
          <Plus size={18} /> New Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-zinc-500">Loading metrics...</div>
        ) : kpis.length === 0 ? (
          <div className="col-span-full p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No KPIs defined.</div>
        ) : (
          kpis.map((kpi: any, i) => (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={kpi.id || i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-medium text-lg text-white w-3/4 leading-tight">{kpi.name || kpi.metric || "Metric"}</h3>
              <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-light tracking-tight text-white">{kpi.current || kpi.value || 0}</span>
              <span className="text-sm text-zinc-500 mb-1">/ {kpi.target || 100} {kpi.unit || "%"}</span>
            </div>

            <div className="w-full bg-black rounded-full h-2.5 mb-4 border border-zinc-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${kpi.progress || (kpi.current && kpi.target ? (kpi.current / kpi.target) * 100 : 0)}%` }} transition={{ duration: 1, delay: 0.2 }}
                className={`h-full rounded-full ${kpi.color === 'blue' || !kpi.color ? 'bg-blue-500' : kpi.color === 'amber' ? 'bg-amber-500' : kpi.color === 'red' ? 'bg-red-500' : 'bg-green-500'}`}
              ></motion.div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">{kpi.progress || Math.round(kpi.current && kpi.target ? (kpi.current / kpi.target) * 100 : 0)}% Complete</span>
              <span className={`px-2 py-1 rounded font-medium border ${kpi.status === 'Achieved' || kpi.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : kpi.status === 'Lagging' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : kpi.status === 'At Risk' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                {kpi.status || "On Track"}
              </span>
            </div>
          </motion.div>
        )))}

        {/* Add New Ghost Card */}
        <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer min-h-[220px]">
          <Plus size={32} className="mb-2" />
          <p className="font-medium">Create Metric</p>
        </div>
      </div>
    </div>
  );
}
