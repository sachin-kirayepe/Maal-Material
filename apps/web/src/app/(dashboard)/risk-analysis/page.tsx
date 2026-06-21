"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Search, ShieldAlert, BarChart2 } from "lucide-react";

import { useRiskAnalysisStore } from "../../../stores/riskAnalysisStore";

export default function VendorRiskAnalysis() {
  const { vendorIntelligence: vendors, isLoading, fetchVendorIntelligence } = useRiskAnalysisStore();

  React.useEffect(() => {
    fetchVendorIntelligence("tenant-1");
  }, [fetchVendorIntelligence]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Activity className="text-red-500" size={28} /> Vendor Risk Analysis
          </h1>
          <p className="text-zinc-400">Advanced AI scoring interface calculating financial health and delivery risks for onboarded vendors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Main Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                <ShieldAlert size={28} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">High Risk Vendors</p>
                <p className="text-3xl font-medium text-white">4</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center">
                <BarChart2 size={28} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Avg Network Risk Score</p>
                <p className="text-3xl font-medium text-white">72/100</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30 flex justify-between items-center">
              <h2 className="text-xl font-medium">Risk Assessment Portfolio</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input type="text" placeholder="Search vendors..." className="bg-black border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-500 text-white" />
              </div>
            </div>
            
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Financial Health</th>
                  <th className="px-6 py-4 text-center">Delivery Delay Risk</th>
                  <th className="px-6 py-4 text-center">Maal-Material Score</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading risk analysis...</td></tr>
                ) : vendors.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No vendor risk data found.</td></tr>
                ) : (
                  vendors.map((vendor: any, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    key={i} className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{vendor.vendorName || vendor.name}</p>
                      <p className="text-xs text-zinc-500">{vendor.category || "General"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded border ${vendor.financialHealth === 'Stable' || vendor.financial === 'Stable' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {vendor.financialHealth || vendor.financial || "Stable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`${parseInt(vendor.deliveryDelayRisk || vendor.delays || '0') > 10 ? 'text-red-400 font-medium' : 'text-zinc-300'}`}>{vendor.deliveryDelayRisk || vendor.delays || "0%"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`font-mono text-lg ${(vendor.constructOsScore || vendor.riskScore) >= 75 ? 'text-green-500' : (vendor.constructOsScore || vendor.riskScore) >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {vendor.constructOsScore || vendor.riskScore || 0}
                        </span>
                        {vendor.trend === 'up' ? <TrendingUp size={16} className="text-green-500"/> : <TrendingDown size={16} className="text-red-500"/>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.riskLevel === 'High' || vendor.riskLevel === 'HIGH' ? (
                        <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400">Review</button>
                      ) : (
                        <span className="text-xs text-zinc-500">Monitored</span>
                      )}
                    </td>
                  </motion.tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <h3 className="font-medium text-red-400 text-lg">Critical Risk Alert</h3>
            </div>
            
            <p className="text-sm text-red-200/80 mb-6">
              <strong className="text-white">Metro Hardware Hub</strong> has shown a <span className="text-red-400">18% increase in delivery delays</span> over the last 30 days. Their financial stability indicator from GST filings shows delayed payments.
            </p>
            
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">AI Recommendations:</p>
              <button className="w-full bg-black border border-zinc-800 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
                Halt Future POs
              </button>
              <button className="w-full bg-black border border-zinc-800 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
                Find Alternative Suppliers
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
