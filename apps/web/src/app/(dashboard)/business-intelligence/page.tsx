"use client";

import React, { useEffect } from "react";
import { PieChart, TrendingUp, TrendingDown, Users, Package, Banknote, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useBIStore } from "../../../stores/biStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function BusinessIntelligence() {
  const tenantId = useTenantId();
  const { isLoading, fetchInsights, fetchAnomalies } = useBIStore();

  useEffect(() => {
    fetchInsights(tenantId);
    fetchAnomalies(tenantId);
  }, [fetchInsights, fetchAnomalies]);

  const handleExport = async () => {
    try {
      toast.info("Queueing BI export...");
      await ApiClient.post("/reports/generate", { templateId: "bi-report", tenantId: tenantId });
      toast.success("Job Queued: You will be notified when the export is ready.");
    } catch (e) {
      toast.error("Failed to queue export job.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1 flex items-center gap-2">
            <PieChart className="text-blue-500" size={24} /> Executive BI Dashboard
          </h1>
          <p className="text-zinc-400 text-sm">Real-time macro metrics aggregated across all modules.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors active:scale-95">
            Export PDF
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Capex", value: insights?.[0]?.totalCapex || "N/A", trend: insights?.[0]?.capexTrend || "N/A", isUp: true, icon: Banknote },
              { title: "Active Vendors", value: insights?.[0]?.activeVendors || "N/A", trend: insights?.[0]?.vendorTrend || "N/A", isUp: true, icon: Users },
              { title: "Avg Material Cost", value: insights?.[0]?.avgMaterialCost || "N/A", trend: insights?.[0]?.costTrend || "N/A", isUp: false, icon: Package },
              { title: "Project Delays", value: insights?.[0]?.projectDelays || "N/A", trend: insights?.[0]?.delayTrend || "N/A", isUp: false, icon: Activity },
            ].map((kpi, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-zinc-400 text-sm font-medium">{kpi.title}</p>
                  <kpi.icon size={16} className="text-zinc-500" />
                </div>
                <h3 className="text-3xl font-medium text-white mb-2">{kpi.value}</h3>
                <div className="flex items-center gap-1 text-sm">
                  {kpi.isUp ? <TrendingUp size={14} className={kpi.title.includes('Delays') ? 'text-red-400' : 'text-green-400'}/> : <TrendingDown size={14} className={kpi.title.includes('Delays') || kpi.title.includes('Cost') ? 'text-green-400' : 'text-red-400'}/>}
                  <span className={kpi.isUp ? (kpi.title.includes('Delays') ? 'text-red-400' : 'text-green-400') : (kpi.title.includes('Delays') || kpi.title.includes('Cost') ? 'text-green-400' : 'text-red-400')}>
                    {kpi.trend} from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        

        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-white font-medium mb-6">Spend Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            <div className="text-zinc-500 text-sm">No data available</div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-medium">{insights?.[0]?.totalCapex || "N/A"}</span>
              <span className="text-xs text-zinc-500 uppercase">Total Spend</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-6 text-sm">
              {(insights?.[0]?.categories || []).map((cat: any, i: number) => (
                 <div key={i} className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> <span className="text-zinc-300">{cat.name || 'Unknown'}</span></div>
              ))}
              {(!insights?.[0]?.categories || insights[0].categories.length === 0) && <span className="text-zinc-500 text-xs">No category data available.</span>}
          </div>
        </div>


        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-medium">Capital Burn Rate vs Budget</h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Actual Burn</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-zinc-600 rounded-full"></div> Projected Budget</span>
            </div>
          </div>
          <div className="h-[250px] relative w-full flex items-center justify-center text-zinc-500 pt-4">
            No chart data available.
          </div>
        </div>

      </div>
      </>)}
    </div>
  );
}
