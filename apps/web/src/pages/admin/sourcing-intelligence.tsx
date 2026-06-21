import React, { useEffect } from "react";
import { usePurchaseIntelligenceStore } from "../../stores/purchaseIntelligenceStore";

export default function SourcingIntelligence() {
  const { analytics, fetchAnalytics, isLoading } = usePurchaseIntelligenceStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
        Sourcing Intelligence Engine
      </h1>

      {isLoading || !analytics ? (
        <p className="text-slate-400">Loading intelligence data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl border-l-4 border-l-emerald-500">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Total Procurement Spend
            </h3>
            <p className="text-3xl font-black mt-2">${analytics.totalSpend.toLocaleString()}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl border-l-4 border-l-blue-500">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Sourcing Efficiency
            </h3>
            <p className="text-3xl font-black mt-2">{analytics.sourcingEfficiency}%</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl border-l-4 border-l-indigo-500">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Vendor Performance
            </h3>
            <p className="text-3xl font-black mt-2">{analytics.vendorPerformanceScore}/100</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl border-l-4 border-l-amber-500">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Risk Index
            </h3>
            <p className="text-3xl font-black mt-2">{analytics.procurementRiskIndex}</p>
          </div>
        </div>
      )}
    </div>
  );
}
