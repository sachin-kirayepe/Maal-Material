"use client";

import React from "react";
import { motion } from "framer-motion";
import { IndianRupee, AlertOctagon, Download } from "lucide-react";

export default function ProjectCosting() {
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
          { label: "Approved BOQ Budget", value: "₹15.5 Cr" },
          { label: "Actual Cost to Date", value: "₹4.2 Cr" },
          { label: "Committed Cost (POs Issued)", value: "₹1.8 Cr" },
          { label: "Remaining Budget", value: "₹9.5 Cr" },
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
          {[
            { cat: "Concrete & Cement", budget: 450, actual: 120, color: "bg-purple-500" },
            { cat: "Steel & Rebars", budget: 600, actual: 180, color: "bg-blue-500" },
            { cat: "Labor & Subcontractors", budget: 300, actual: 80, color: "bg-amber-500" },
            { cat: "Equipment Rentals", budget: 200, actual: 40, color: "bg-green-500" },
          ].map((item, i) => {
            const percent = (item.actual / item.budget) * 100;
            return (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-zinc-300 font-medium">{item.cat}</span>
                  <div className="text-sm">
                    <span className="text-white">₹{item.actual}L</span>
                    <span className="text-zinc-500"> / ₹{item.budget}L</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-black border border-zinc-800 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
        <AlertOctagon className="text-red-400 mt-1" size={24} />
        <div>
          <h3 className="text-red-400 font-medium text-lg mb-1">Budget Overrun Alert</h3>
          <p className="text-red-200/70 text-sm">Steel & Rebar costs are trending 12% higher than the baseline BOQ estimate due to market price fluctuations. Consider revising the budget or negotiating new supplier contracts.</p>
        </div>
      </div>
    </div>
  );
}
