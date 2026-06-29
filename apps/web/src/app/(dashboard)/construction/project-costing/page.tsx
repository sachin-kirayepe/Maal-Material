"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, AlertOctagon, Download } from "lucide-react";
import { useProjectCostingStore } from "@/stores/projectCostingStore";
import { useTenantId } from "@/hooks/useTenantId";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ProjectCosting() {
  const tenantId = useTenantId();
  const { records, isLoading, fetchRecords } = useProjectCostingStore();

  useEffect(() => {
    // Assuming tenantId can act as a default scope if no specific project is selected
    if (tenantId) {
      fetchRecords(tenantId);
    }
  }, [tenantId, fetchRecords]);

  const totalCost = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <IndianRupee className="text-purple-500" size={28} /> Budget vs Actual Costing
          </h1>
          <p className="text-zinc-400">Track project expenses against the approved Bill of Quantities (BOQ).</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors">
          <Download size={18} /> Export Cost Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Approved BOQ Budget", value: "N/A" },
          { label: "Actual Cost to Date", value: isLoading ? "—" : `${totalCost.toLocaleString()}` },
          { label: "Committed Cost (POs Issued)", value: "N/A" },
          { label: "Remaining Budget", value: "N/A" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-sm text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-medium mb-6">Cost Breakdown by Category</h2>
        
        <div className="space-y-6">
          {isLoading ? (
             <><SkeletonCard className="h-8" /><SkeletonCard className="h-8" /></>
          ) : records.length === 0 ? (
             <EmptyState icon={IndianRupee} title="No Costs Logged" description="There are no cost records for this project yet." />
          ) : (
             records.map((item, i) => {
               // Dynamically render whatever we have, or fallback to zero if we can't compute a budget
               const budget = 0;
               const percent = budget > 0 ? (item.amount / budget) * 100 : 100;
               return (
                 <div key={item.id || i}>
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-sm text-zinc-300 font-medium">{item.category || "General"}</span>
                     <div className="text-sm">
                       <span className="text-white">{item.amount.toLocaleString()}</span>
                       <span className="text-zinc-500"> / N/A</span>
                     </div>
                   </div>
                   <div className="w-full h-3 bg-black border border-zinc-800 rounded-full overflow-hidden flex">
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                       className={`h-full ${percent > 100 ? 'bg-red-500' : 'bg-purple-500'}`}
                     />
                   </div>
                 </div>
               )
             })
          )}
        </div>
      </div>
    </div>
  );
}
