"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, Activity, FileStack, AlertCircle } from "lucide-react";
import { useFinanceStore } from "@/stores/financeStore";
import { useTenantId } from "@/hooks/useTenantId";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { toast } from "sonner";

export default function FinancialDashboard() {
  const tenantId = useTenantId();
  const { profitability, cashFlow, loading, fetchFinanceIntelligence } = useFinanceStore();

  useEffect(() => {
    if (tenantId) fetchFinanceIntelligence();
  }, [tenantId, fetchFinanceIntelligence]);

  const handleAlertAction = (actionName: string) => {
    toast.promise(Promise.resolve(), {
      loading: "Processing action...",
      success: `${actionName} completed successfully.`,
      error: "Failed to process action.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <LayoutDashboard className="text-purple-500" size={28} /> CFO Overview
          </h1>
          <p className="text-zinc-400">High-level financial health, cash flow projections, and macro metrics.</p>
        </div>
        <select className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-white">
          <option>Q2 FY2026-27</option>
          <option>Q1 FY2026-27</option>
          <option>FY2025-26 Annual</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg"><DollarSign className="text-purple-400" size={20}/></div>
            <p className="text-zinc-400 text-sm">Total Revenue (YTD)</p>
          </div>
          <p className="text-3xl font-medium mb-2">{loading ? "—" : `${(profitability?.totalRevenue || 0).toLocaleString()}`}</p>
          <div className="flex items-center gap-2 text-xs text-green-400"><TrendingUp size={14}/> {profitability?.revenueGrowth || "0%"} YoY</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg"><TrendingDown className="text-red-400" size={20}/></div>
            <p className="text-zinc-400 text-sm">Operating Expenses</p>
          </div>
          <p className="text-3xl font-medium mb-2">{loading ? "—" : `${(profitability?.operatingExpenses || 0).toLocaleString()}`}</p>
          <div className="flex items-center gap-2 text-xs text-red-400"><TrendingUp size={14}/> {profitability?.expenseGrowth || "0%"} YoY</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg"><FileStack className="text-amber-400" size={20}/></div>
            <p className="text-zinc-400 text-sm">Accounts Receivable</p>
          </div>
          <p className="text-3xl font-medium mb-2">{loading ? "—" : `${(cashFlow?.receivables || 0).toLocaleString()}`}</p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">Average collection: {cashFlow?.avgCollectionDays || 0} Days</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="text-blue-400" size={20}/></div>
              <p className="text-zinc-400 text-sm">Net Profit Margin</p>
            </div>
            <p className="text-3xl font-medium text-blue-400 mb-2">{loading ? "—" : `${profitability?.netMargin || 0}%`}</p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="w-[12.5%] bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: `${profitability?.netMargin || 0}%` }}></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cash Flow Projection */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium text-lg mb-6">30-Day Cash Flow Projection</h3>
          {loading ? (
            <div className="h-64"><SkeletonCard className="h-full" /></div>
          ) : !cashFlow?.projections || cashFlow.projections.length === 0 ? (
            <div className="h-64">
              <EmptyState icon={Activity} title="No Projections" description="Insufficient historical data to generate cash flow projections." />
            </div>
          ) : (
            <>
              <div className="h-64 flex items-end justify-between gap-1 border-b border-zinc-800 pb-2">
                {cashFlow.projections.map((val: number, i: number) => (
                  <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: `${Math.abs(val)}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                      className={`w-full rounded-sm ${val > 0 ? 'bg-green-500/50' : 'bg-red-500/50'} relative`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black px-2 py-1 rounded text-zinc-300 pointer-events-none">
                        {Math.abs(val)}L
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-zinc-500">
                <span>Today</span>
                <span>+15 Days</span>
                <span>+30 Days</span>
              </div>
            </>
          )}
        </div>

        {/* Working Capital Alerts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-medium text-lg mb-6 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={20} /> Working Capital Alerts
          </h3>
          <div className="space-y-4 flex-1">
            {loading ? (
              <><SkeletonCard className="p-4" /><SkeletonCard className="p-4" /></>
            ) : !profitability?.alerts || profitability.alerts.length === 0 ? (
              <EmptyState icon={AlertCircle} title="No Active Alerts" description="Your working capital and accounts look healthy." />
            ) : (
              profitability.alerts.map((alert: any, idx: number) => (
                <div key={idx} className="bg-black border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
                  <div className="mt-1">
                    {alert.severity === 'high' ? <AlertCircle size={18} className="text-red-400" /> : <TrendingUp size={18} className="text-green-400" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">{alert.title}</h4>
                    <p className="text-sm text-zinc-400">{alert.description}</p>
                    {alert.actionText && (
                      <button onClick={() => handleAlertAction(alert.actionText)} className={`mt-3 text-xs font-medium hover:opacity-80 ${alert.severity === 'high' ? 'text-red-400' : 'text-green-400'}`}>
                        {alert.actionText} →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
