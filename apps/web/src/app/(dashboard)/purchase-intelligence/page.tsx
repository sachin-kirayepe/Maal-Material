"use client";

import React from "react";

import { Lightbulb, ShoppingCart, Percent, TrendingDown, ArrowRight } from "lucide-react";

export default function PurchaseIntelligence() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Lightbulb className="text-yellow-500" size={28} /> Smart Sourcing Recommendations
          </h1>
          <p className="text-zinc-400">AI-driven suggestions to optimize procurement, timing, and vendor selection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Recommendation Cards */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart size={80} className="text-yellow-500" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-yellow-500 bg-yellow-500/10 w-fit px-2 py-1 rounded border border-yellow-500/20 mb-4 uppercase tracking-widest">
            <TrendingDown size={14} /> Price Drop Alert
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Buy Steel (TMT 8mm) Now</h3>
          <p className="text-sm text-zinc-400 mb-6">Market prices have dropped by 2.4% this week. Your AI forecast predicts a requirement of 50 MT in 12 days. Buying now could save approximately ₹65,000.</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <div className="text-sm">
              <span className="text-zinc-500 block text-xs">Recommended Vendor</span>
              <span className="text-white font-medium">Jindal Steel (92/100 Score)</span>
            </div>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors">
              Draft PO
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Percent size={80} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 w-fit px-2 py-1 rounded border border-blue-500/20 mb-4 uppercase tracking-widest">
            <Lightbulb size={14} /> Bulk Discount
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Combine Paint Orders</h3>
          <p className="text-sm text-zinc-400 mb-6">Project Alpha and Project Gamma both need Asian Paints Apex next week. Combining these into a single PO crosses the 100-bucket tier, unlocking a 5% volume discount.</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <div className="text-sm">
              <span className="text-zinc-500 block text-xs">Estimated Savings</span>
              <span className="text-green-400 font-medium">₹12,400</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
              Merge & Draft
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group opacity-70">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-800 w-fit px-2 py-1 rounded mb-4 uppercase tracking-widest">
            <ArrowRight size={14} /> Vendor Switch
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Switch Cement Supplier</h3>
          <p className="text-sm text-zinc-400 mb-6">Current supplier 'Metro Hub' has high delay risk. 'Apex Builders' offers same OPC 53 Grade with 98% on-time delivery at +₹5/bag.</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <button className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
              Review Alternatives
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
