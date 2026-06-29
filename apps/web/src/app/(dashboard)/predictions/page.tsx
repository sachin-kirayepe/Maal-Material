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

          <div className="h-[400px] w-full relative flex items-center justify-center text-zinc-500">
            No prediction data available.
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-cyan-500"/> Key Forecasts</h3>
            <div className="space-y-4">
              <div className="text-sm text-zinc-500 text-center py-4">No key forecasts generated yet.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
