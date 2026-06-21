"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coffee, ArrowRight, Lightbulb, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";

export default function DailyInsights() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Coffee className="text-amber-500" size={28} /> Daily Executive Insights
          </h1>
          <p className="text-zinc-400">Your AI-generated morning digest summarizing platform health, risks, and opportunities.</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-white">Monday, 15 Jun 2026</p>
          <p className="text-sm text-zinc-500">Prepared at 08:00 AM</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <Sparkles className="text-amber-500 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-medium text-amber-500 mb-2">Good Morning, Chief!</h2>
              <p className="text-zinc-300 leading-relaxed">
                Overall platform health is strong at 94%. We've successfully processed 142 POs in the last 24 hours. However, there are two emerging risks in the logistics module regarding steel deliveries, and one immediate opportunity to save costs on upcoming cement purchases.
              </p>
            </div>
          </div>
        </div>

        {/* The Insights Feed */}
        <div className="space-y-4">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
              <ShieldAlert className="text-red-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Logistics Risk at Project Alpha</h3>
              <p className="text-sm text-zinc-400 mb-4">
                We've detected a pattern of delays from 'Apex Builders' (Vendor Score dropped to 68). They have missed 3 delivery windows for TMT Steel this week. If this continues, it will impact slab casting scheduled for Thursday.
              </p>
              <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View Alternatives & Reroute
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center shrink-0 border border-green-500/20">
              <Lightbulb className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Cost Saving Opportunity (₹1.2L)</h3>
              <p className="text-sm text-zinc-400 mb-4">
                National prices for OPC 53 Grade Cement have dipped temporarily by 3.5%. You have 4 upcoming POs drafted for next week across different sites. Aggregating these today will lock in the lower rate.
              </p>
              <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Approve Aggregation
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0 border border-blue-500/20">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Financial Milestone Reached</h3>
              <p className="text-sm text-zinc-400 mb-4">
                The auto-approval engine successfully processed 82% of all invoices under ₹50k yesterday, saving approximately 14 hours of manual audit time. Error rate remains at 0.01%.
              </p>
              <button className="flex items-center gap-1 text-xs text-blue-400 hover:underline font-medium transition-colors">
                View Engine Logs <ArrowRight size={14}/>
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
