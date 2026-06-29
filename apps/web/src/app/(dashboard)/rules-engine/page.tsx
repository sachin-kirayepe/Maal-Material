"use client";

import React from "react";
import { Sliders, Plus, ArrowRight, Zap } from "lucide-react";

export default function RulesEngine() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Sliders className="text-indigo-500" size={28} /> Custom Rules Engine
          </h1>
          <p className="text-zinc-400">Build automated "If-This-Then-That" business logic without writing code.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-500 transition-colors">
          <Plus size={18} /> New Rule
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Rule 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg text-white">High Value PO Approval</h3>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
            </div>
          </div>
          
          <div className="flex items-stretch gap-4">
            <div className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 relative">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">IF</div>
              <div className="flex items-center gap-3">
                <select className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option>PO Value</option>
                  <option>Vendor Score</option>
                </select>
                <select className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option>is greater than</option>
                  <option>is less than</option>
                </select>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></span>
                  <input type="number" defaultValue={10000000} className="bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none w-32" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center px-2">
              <ArrowRight className="text-zinc-600" size={24} />
            </div>

            <div className="flex-1 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 relative">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><Zap size={10}/> THEN</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-zinc-300">Require approval from:</span>
                <select className="bg-indigo-900/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-indigo-200 focus:outline-none">
                  <option>Director</option>
                  <option>Project Manager</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg text-white">Vendor Blacklisting</h3>
            <div className="flex items-center gap-2 bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span> Draft
            </div>
          </div>
          
          <div className="flex items-stretch gap-4">
            <div className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 relative">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">IF</div>
              <div className="flex items-center gap-3">
                <select className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option>Vendor Trust Score</option>
                </select>
                <select className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option>drops below</option>
                </select>
                <input type="number" defaultValue={40} className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none w-20" />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center px-2">
              <ArrowRight className="text-zinc-600" size={24} />
            </div>

            <div className="flex-1 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 relative">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><Zap size={10}/> THEN</div>
              <div className="flex items-center gap-3 mt-1">
                <select className="bg-indigo-900/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-indigo-200 focus:outline-none w-full">
                  <option>Suspend Vendor Account immediately</option>
                  <option>Send Warning Email</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
