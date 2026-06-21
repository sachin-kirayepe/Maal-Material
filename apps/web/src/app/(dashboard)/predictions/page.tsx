"use client";

import React from "react";
import { TrendingUp, Activity } from "lucide-react";

export default function Predictions() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-cyan-500" size={28} /> Demand Forecasting
          </h1>
          <p className="text-zinc-400">Time-series predictions for future material requirements based on project timelines and past usage.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none">
            <option>Project Alpha (BKC)</option>
            <option>All Projects</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-medium">Cement (OPC 53) Forecast - Next 30 Days</h2>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Actual Usage</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div> AI Prediction</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500/20 rounded-full"></div> Confidence Interval</span>
            </div>
          </div>

          <div className="h-[400px] w-full relative">
            <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-8 border-l border-zinc-800 pl-4">
              <div className="w-full border-t border-zinc-800/50 flex justify-end text-[10px] text-zinc-600 -mt-1">500 Bags</div>
              <div className="w-full border-t border-zinc-800/50 flex justify-end text-[10px] text-zinc-600 -mt-1">400 Bags</div>
              <div className="w-full border-t border-zinc-800/50 flex justify-end text-[10px] text-zinc-600 -mt-1">300 Bags</div>
              <div className="w-full border-t border-zinc-800/50 flex justify-end text-[10px] text-zinc-600 -mt-1">200 Bags</div>
              <div className="w-full border-t border-zinc-800/50 flex justify-end text-[10px] text-zinc-600 -mt-1">100 Bags</div>
            </div>

            {/* Confidence Interval Area */}
            <svg className="absolute inset-0 w-full h-full pb-8 pl-4" preserveAspectRatio="none">
              <path d="M400,200 L500,180 L600,220 L700,150 L800,280 L900,190 L1000,160 L1000,320 L900,350 L800,400 L700,250 L600,300 L500,260 L400,280 Z" fill="rgba(6, 182, 212, 0.1)" />
            </svg>

            {/* AI Prediction Line */}
            <svg className="absolute inset-0 w-full h-full pb-8 pl-4" preserveAspectRatio="none">
              <path d="M400,240 L500,220 L600,260 L700,200 L800,340 L900,270 L1000,240" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            {/* Actual Data Line */}
            <svg className="absolute inset-0 w-[40%] h-full pb-8 pl-4" preserveAspectRatio="none">
              <path d="M0,280 L100,250 L200,290 L300,190 L400,240" fill="none" stroke="#3b82f6" strokeWidth="3" />
            </svg>

            <div className="absolute bottom-2 left-4 right-0 flex justify-between text-[10px] text-zinc-500 border-t border-zinc-800 pt-2">
              <span>Today -15d</span><span>Today -10d</span><span>Today -5d</span><span className="text-cyan-500 font-medium">Today</span><span>Day +5</span><span>Day +10</span><span>Day +15</span>
            </div>

            {/* Now Line */}
            <div className="absolute top-0 bottom-8 left-[40%] border-l-2 border-dashed border-cyan-500/50 z-10 flex flex-col items-center">
              <div className="bg-cyan-500 text-black text-[10px] px-2 py-0.5 rounded-full font-medium -mt-2">Now</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-cyan-500"/> Key Forecasts</h3>
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-sm font-medium text-white">Peak Demand Alert</p>
                <p className="text-xs text-zinc-400 mt-1">Expected spike in Cement usage around <span className="text-cyan-400 font-medium">Day +8</span> due to slab casting schedule.</p>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-sm font-medium text-white">Stock Depletion</p>
                <p className="text-xs text-zinc-400 mt-1">Current on-site inventory will run out by <span className="text-red-400 font-medium">Day +4</span>. Procurement recommended.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
