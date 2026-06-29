"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, ArrowRight, Check, X, Building2 } from "lucide-react";

export default function CreditLine() {
  const [amount, setAmount] = useState(500000);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Landmark className="text-purple-500" size={28} /> Credit Line Management
          </h1>
          <p className="text-zinc-400">Request working capital credit limits and approve supplier credit lines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Credit Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-zinc-800/50"><Building2 size={120} /></div>
          
          <h2 className="text-2xl font-light mb-6 relative z-10">Request Vendor Credit Line</h2>
          <p className="text-zinc-400 text-sm mb-8 relative z-10">Apply for a rolling credit limit to ease cash flow constraints. Subject to Maal-Material risk approval.</p>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Requested Credit Limit ()</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="100000" 
                  max="5000000" 
                  step="100000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="font-medium text-xl w-32 text-right">{(amount/100000).toFixed(1)}L</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Primary Purpose</label>
              <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white text-sm">
                <option>Raw Material Procurement</option>
                <option>Equipment Leasing</option>
                <option>Labor Wage Payouts</option>
              </select>
            </div>

            <div className="pt-4">
              <button className="bg-purple-500 text-white w-full py-3 rounded-xl font-medium hover:bg-purple-400 transition-colors flex justify-center items-center gap-2">
                Submit Application <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div>
          <h2 className="text-xl font-medium mb-6">Pending Approvals (Admin)</h2>
          <div className="space-y-4">
            {[
              { id: "CR-092", supplier: "Metro Builders", amount: "15,00,000", score: "84/100", status: "Pending Review" },
              { id: "CR-091", supplier: "Apex Steel", amount: "5,00,000", score: "92/100", status: "Pending Review" }
            ].map((req, i) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg text-purple-400">{req.supplier}</h3>
                    <p className="text-sm text-zinc-500">Ref: {req.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium">{req.amount}</p>
                    <p className="text-xs text-green-400">Risk Score: {req.score}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-500 font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-green-500/20">
                    <Check size={16} /> Approve
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-red-500/20">
                    <X size={16} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
