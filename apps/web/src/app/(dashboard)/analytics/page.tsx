"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, LineChart, PieChart, Settings2, Save } from "lucide-react";

export default function AnalyticsBuilder() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BarChart3 className="text-indigo-500" size={28} /> Custom Graph Builder
          </h1>
          <p className="text-zinc-400">Drag and drop data sources to build custom visualizations and export them to your dashboard.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-400 transition-colors">
          <Save size={18} /> Save Chart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-160px)]">
        
        {/* Data Sources Sidebar */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-medium mb-4 text-zinc-300">Data Sources</h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-2">Finance</p>
              <div className="space-y-2">
                <div className="bg-black border border-zinc-800 p-3 rounded-xl cursor-grab hover:border-indigo-500 transition-colors">
                  <p className="text-sm font-medium text-white">Monthly Revenue</p>
                  <p className="text-xs text-zinc-500 mt-1">Y-Axis • Numeric</p>
                </div>
                <div className="bg-black border border-zinc-800 p-3 rounded-xl cursor-grab hover:border-indigo-500 transition-colors">
                  <p className="text-sm font-medium text-white">Project Budgets</p>
                  <p className="text-xs text-zinc-500 mt-1">Group By • Category</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-2 mt-4">Logistics</p>
              <div className="space-y-2">
                <div className="bg-black border border-zinc-800 p-3 rounded-xl cursor-grab hover:border-indigo-500 transition-colors">
                  <p className="text-sm font-medium text-white">Delivery Delays</p>
                  <p className="text-xs text-zinc-500 mt-1">Y-Axis • Numeric</p>
                </div>
                <div className="bg-black border border-zinc-800 p-3 rounded-xl cursor-grab hover:border-indigo-500 transition-colors">
                  <p className="text-sm font-medium text-white">Timeline</p>
                  <p className="text-xs text-zinc-500 mt-1">X-Axis • Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas & Config Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Chart Type Selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-medium text-sm">
              <BarChart3 size={16}/> Bar Chart
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black border border-zinc-800 text-zinc-400 hover:text-white rounded-xl font-medium text-sm transition-colors">
              <LineChart size={16}/> Line Graph
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black border border-zinc-800 text-zinc-400 hover:text-white rounded-xl font-medium text-sm transition-colors">
              <PieChart size={16}/> Pie Chart
            </button>
          </div>

          {/* Builder Canvas */}
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative flex flex-col">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <input type="text" defaultValue="Revenue vs Delays Analysis" className="bg-transparent text-xl font-medium text-white focus:outline-none focus:border-b focus:border-indigo-500" />
              <button className="text-zinc-400 hover:text-white"><Settings2 size={20}/></button>
            </div>

            {/* Drop Zones */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 bg-black border border-dashed border-zinc-700 rounded-xl p-4 flex items-center justify-center text-zinc-500 text-sm">
                Drop X-Axis Data Here (e.g. Timeline)
              </div>
              <div className="flex-1 bg-black border border-dashed border-indigo-500/50 rounded-xl p-4 flex items-center justify-between text-indigo-400 text-sm bg-indigo-500/5">
                <span>Monthly Revenue (Y-Axis)</span>
                <button className="text-indigo-400 hover:text-white">&times;</button>
              </div>
            </div>


            <div className="flex-1 border border-zinc-800 rounded-xl flex items-end justify-between p-8 pb-0 gap-2 relative bg-black/50">

              <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between text-[10px] text-zinc-600">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="absolute left-10 right-4 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
                <div className="w-full h-px bg-zinc-800/50"></div>
                <div className="w-full h-px bg-zinc-800/50"></div>
                <div className="w-full h-px bg-zinc-800/50"></div>
                <div className="w-full h-px bg-zinc-800/50"></div>
              </div>

              {/* Bars */}
              {[].map((h, i) => (
                <div key={i} className="w-full relative group z-10 flex justify-center">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-12 bg-indigo-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 font-medium">
                      {(h).toFixed(0)}
                    </div>
                  </motion.div>
                </div>
              ))}
              

              <div className="absolute left-10 right-4 -bottom-6 flex justify-between text-[10px] text-zinc-500 px-4">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
