"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, HardHat, TrendingUp, Calendar as CalendarIcon, Filter, Download, Loader2, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useWorkerStore } from "@/stores/workerStore";
import { ApiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useTenantId } from "@/hooks/useTenantId";

export default function LaborTracking() {
  const tenantId = useTenantId();
  const { workers, meta, isLoading, fetchWorkers, skillBreakdown, fetchSkillBreakdown } = useWorkerStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchWorkers({ page: currentPage, limit: 10 });
    fetchSkillBreakdown();
  }, [fetchWorkers, fetchSkillBreakdown, currentPage]);

  const totalHeadcount = workers.length > 0 && meta ? meta.total : 0;
  const totalDailyWage = skillBreakdown.reduce((sum: number, item: any) => sum + (item.count * item.avgDailyWage), 0);

  const handleExport = async () => {
    try {
      toast.info("Queueing report generation job...");
      await ApiClient.post("/reports/generate", { templateId: "labor-report", tenantId: tenantId });
      toast.success("Job Queued: You will be notified when the report is ready to download.");
    } catch (e) {
      toast.error("Failed to queue export job.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Users className="text-purple-500" size={28} /> Labor Headcount & Wages
          </h1>
          <p className="text-zinc-400">Track daily site attendance, categorize labor types, and compute daily wage costs.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors shadow-lg active:scale-95">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg"><HardHat size={20} className="text-blue-400" /></div>
          </div>
          <p className="text-sm text-zinc-400 mb-1">Today's Headcount</p>
          <p className="text-3xl font-medium">{totalHeadcount} <span className="text-sm font-normal text-zinc-500">workers</span></p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg"><TrendingUp size={20} className="text-red-400" /></div>
          </div>
          <p className="text-sm text-zinc-400 mb-1">Daily Labor Cost</p>
          <p className="text-3xl font-medium text-red-400">{totalDailyWage.toLocaleString()}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center items-start">
          <div className="absolute -right-4 -bottom-4 text-zinc-800/50"><Users size={120} /></div>
          <p className="text-sm text-zinc-400 mb-2 relative z-10">Log Attendance for</p>
          <h3 className="text-xl font-medium text-white mb-4 relative z-10">15 June, 2026</h3>
          <button className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors relative z-10">
            Submit Today's Log
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium flex items-center gap-2">
            <CalendarIcon size={18} className="text-zinc-400" /> Daily Labor Roster
          </h2>
          <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
            <Filter size={16} className="text-zinc-400" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Worker Name</th>
                <th className="px-6 py-4">Skill Category</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Contractor/Team</th>
                <th className="px-6 py-4 text-right">Daily Wage ()</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                    Loading workers...
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No workers found.
                  </td>
                </tr>
              ) : workers.map((worker: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  key={worker.id} className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                      {worker.name?.substring(0, 2).toUpperCase() || "W"}
                    </div>
                    {worker.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-zinc-800/50 border-zinc-700 text-xs w-max">
                      <HardHat size={12} className="text-purple-400" /> {worker.skillType}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Phone size={14} className="text-zinc-500" /> {worker.mobile}
                  </td>
                  <td className="px-6 py-4">{worker.contractorName || "Direct Hire"}</td>
                  <td className="px-6 py-4 text-right text-white font-medium">{worker.dailyWage?.toLocaleString() || "0"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <span className="text-sm text-zinc-500">
            {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={isLoading || currentPage === 1}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-zinc-400" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={isLoading || (meta && currentPage >= meta.totalPages)}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
