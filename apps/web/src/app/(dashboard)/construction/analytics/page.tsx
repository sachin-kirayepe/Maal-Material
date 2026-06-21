"use client";

import React from "react";
import { LineChart, Users, HardHat, TrendingUp, ArrowUpRight } from "lucide-react";

export default function OperationalAnalytics() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <LineChart className="text-purple-500" size={28} /> Site Operations Analytics
          </h1>
          <p className="text-zinc-400">Measure labor productivity, material wastage, and overall site efficiency.</p>
        </div>
        <select className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-white">
          <option>Project Alpha (Bandra)</option>
          <option>Project Beta (Andheri)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-zinc-400">Labor Productivity Index</p>
            <Users size={16} className="text-blue-400" />
          </div>
          <p className="text-3xl font-medium mb-2">92.4%</p>
          <p className="text-xs text-green-400 flex items-center gap-1"><ArrowUpRight size={12}/> +4.2% from last week</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-zinc-400">Material Wastage Rate</p>
            <TrendingUp size={16} className="text-amber-400" />
          </div>
          <p className="text-3xl font-medium mb-2">3.8%</p>
          <p className="text-xs text-red-400 flex items-center gap-1"><ArrowUpRight size={12}/> +0.5% over target limit</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-zinc-400">Schedule Variance</p>
            <HardHat size={16} className="text-purple-400" />
          </div>
          <p className="text-3xl font-medium text-green-400 mb-2">On Track</p>
          <p className="text-xs text-zinc-500">0 days delayed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Chart Mockup */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium text-lg mb-6">Daily Output vs Labor Headcount</h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-zinc-800 pb-2 relative">
            {/* Fake line chart overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path d="M 0 200 C 100 180, 200 150, 300 100 S 400 50, 500 80" fill="transparent" stroke="#a855f7" strokeWidth="3" />
            </svg>
            
            {[60, 65, 80, 75, 90, 85, 95].map((val, i) => (
              <div key={i} className="w-12 bg-zinc-800 rounded-t-sm relative flex flex-col justify-end" style={{ height: `${val}%` }}>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500">Day {i+1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Insights */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium text-lg mb-6">Operational Insights</h3>
          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="font-medium text-white mb-1">Optimum Labor Allocation</p>
              <p className="text-sm text-zinc-400">Data suggests a peak efficiency at 45 workers/day for the current plinth activity. Adding more workers is yielding diminishing returns.</p>
            </div>
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="font-medium text-white mb-1">Equipment Idle Time</p>
              <p className="text-sm text-zinc-400">The Tower Crane (CRN-04) had 2.5 hours of idle time yesterday waiting for materials. Optimize delivery schedules to maximize crane utilization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
