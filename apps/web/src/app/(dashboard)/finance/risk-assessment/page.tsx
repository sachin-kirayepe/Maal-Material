"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, AlertTriangle, ShieldCheck, PieChart, Activity } from "lucide-react";

import { useRiskAssessmentStore } from "@/stores/riskAssessmentStore";

export default function RiskAssessment() {
  const { assessments: suppliers, isLoading, fetchAssessments } = useRiskAssessmentStore();

  React.useEffect(() => {
    fetchAssessments("tenant-1");
  }, [fetchAssessments]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="text-purple-500" size={28} /> Financial Risk Assessment
          </h1>
          <p className="text-zinc-400">AI-driven risk scoring for suppliers, subcontractors, and overall project financial health.</p>
        </div>
      </div>

      {/* Main Risk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-zinc-800/30"><Activity size={180} /></div>
          
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-48 h-48 rounded-full border-[16px] border-green-500/20 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.1)]">
              {/* Fake SVG Circle Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="#22c55e" strokeWidth="16" strokeDasharray="264" strokeDashoffset="60" className="opacity-90" />
              </svg>
              <h2 className="text-5xl font-light text-white">82</h2>
              <p className="text-xs text-green-400 font-medium mt-1 uppercase tracking-widest">Good</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-light mb-2">Overall Portfolio Risk Score</h2>
              <p className="text-zinc-400 mb-6 max-w-md">Your network of 86 suppliers and subcontractors has a healthy aggregate score. Default probability over the next 90 days is estimated at &lt; 2.5%.</p>
              
              <div className="flex gap-4">
                <div className="bg-black border border-zinc-800 px-4 py-2 rounded-xl">
                  <p className="text-xs text-zinc-500 mb-1">Exposure Limit</p>
                  <p className="font-medium text-lg text-white">₹5.0 Cr</p>
                </div>
                <div className="bg-black border border-zinc-800 px-4 py-2 rounded-xl">
                  <p className="text-xs text-zinc-500 mb-1">Current Exposure</p>
                  <p className="font-medium text-lg text-white">₹1.8 Cr</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2"><PieChart size={18} className="text-purple-400"/> AI Risk Insights</h3>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-1">Apex Steel Downgrade</h4>
                  <p className="text-xs text-red-200/70">Supplier score dropped by 15 points due to late GST filings. Recommend halting advance payments.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-1">Portfolio Stabilized</h4>
                  <p className="text-xs text-green-200/70">Top 10 suppliers have maintained on-time deliveries. Credit exposure is well within safe limits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Risk Matrix */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-medium">Counterparty Risk Matrix</h2>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Supplier / Subcontractor</th>
              <th className="px-6 py-4">Risk Score (1-100)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">30-Day Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={4} className="py-8 text-center text-zinc-500">Evaluating risks...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No risk assessments found.</td></tr>
            ) : (
              suppliers.map((sup: any, i: number) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={sup.id || i} className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-white">{sup.name || sup.entityId || "Supplier"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-lg ${(sup.score || sup.riskScore || 0) > 80 ? 'text-green-400' : (sup.score || sup.riskScore || 0) > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {sup.score || sup.riskScore || 0}
                    </span>
                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(sup.score || sup.riskScore || 0) > 80 ? 'bg-green-500' : (sup.score || sup.riskScore || 0) > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sup.score || sup.riskScore || 0}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${(sup.status || sup.riskType) === 'Low Risk' || (sup.status || sup.riskType) === 'LOW' ? 'bg-green-500/10 text-green-500 border-green-500/20' : (sup.status || sup.riskType) === 'Medium Risk' || (sup.status || sup.riskType) === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {sup.status || sup.riskType || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  {(sup.trend === 'Stable' || !sup.trend) && <TrendingUp size={16} className="text-blue-400 rotate-45" />}
                  {sup.trend === 'Improving' && <TrendingUp size={16} className="text-green-400" />}
                  {sup.trend === 'Declining' && <TrendingUp size={16} className="text-red-400 rotate-90" />}
                  {sup.trend || "Stable"}
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
