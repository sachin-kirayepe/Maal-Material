"use client";

import React from "react";
import { GitMerge, GripVertical, Check, ArrowDown } from "lucide-react";

export default function SimplifiedWorkflows() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <GitMerge className="text-rose-500" size={28} /> Visual Workflow Builder
          </h1>
          <p className="text-zinc-400">Drag and drop nodes to create custom approval chains and process flowcharts.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
            <option>Invoice Approval Flow</option>
            <option>New Hire Onboarding</option>
          </select>
          <button className="flex items-center gap-2 bg-rose-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-rose-500 transition-colors">
            Deploy Flow
          </button>
        </div>
      </div>

      <div className="flex gap-8 h-[calc(100vh-160px)]">
        
        {/* Canvas */}
        <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-start pt-16">
          {/* Background Grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Start Node */}
            <div className="bg-black border border-zinc-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl">
              Invoice Submitted
            </div>
            
            <ArrowDown className="text-zinc-600 my-2" size={20} />

            {/* Condition Node */}
            <div className="bg-black border-2 border-amber-500/50 text-amber-500 px-8 py-4 rounded-lg shadow-xl text-center rotate-45 transform w-24 h-24 flex items-center justify-center relative">
              <span className="-rotate-45 text-xs font-medium block w-24 text-center absolute">Value &gt; 1L?</span>
            </div>

            <div className="flex w-64 justify-between -mt-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-amber-500 font-medium bg-black px-1 z-10">Yes</span>
                <div className="w-px h-12 bg-zinc-600"></div>
                <ArrowDown className="text-zinc-600 -mt-1" size={20} />
                <div className="bg-black border border-zinc-700 px-6 py-3 rounded-lg shadow-xl text-sm flex items-center gap-3 cursor-grab hover:border-rose-500 transition-colors">
                  <GripVertical size={14} className="text-zinc-600"/> Director Approval
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-400 font-medium bg-black px-1 z-10">No</span>
                <div className="w-px h-12 bg-zinc-600"></div>
                <ArrowDown className="text-zinc-600 -mt-1" size={20} />
                <div className="bg-black border border-zinc-700 px-6 py-3 rounded-lg shadow-xl text-sm flex items-center gap-3 cursor-grab hover:border-rose-500 transition-colors">
                  <GripVertical size={14} className="text-zinc-600"/> PM Approval
                </div>
              </div>
            </div>

            <div className="flex w-64 justify-between mt-2">
              <div className="flex flex-col items-center w-full">
                <div className="w-px h-8 bg-zinc-600"></div>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-px h-8 bg-zinc-600"></div>
              </div>
            </div>
            <div className="w-48 h-px bg-zinc-600 -mt-8"></div>
            
            <div className="w-px h-8 bg-zinc-600"></div>
            <ArrowDown className="text-zinc-600 -mt-1" size={20} />

            {/* End Node */}
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-full text-sm font-medium shadow-xl flex items-center gap-2">
              <Check size={16}/> Push to Ledger
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="font-medium text-white mb-4 text-sm">Action Nodes</h3>
            <div className="space-y-2">
              <div className="bg-black border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 cursor-grab hover:border-rose-500 flex items-center gap-2">
                <GripVertical size={14} className="text-zinc-600"/> Require Approval
              </div>
              <div className="bg-black border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 cursor-grab hover:border-rose-500 flex items-center gap-2">
                <GripVertical size={14} className="text-zinc-600"/> Send Email Alert
              </div>
              <div className="bg-black border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 cursor-grab hover:border-rose-500 flex items-center gap-2">
                <GripVertical size={14} className="text-zinc-600"/> Update Database
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="font-medium text-white mb-4 text-sm">Logic Nodes</h3>
            <div className="space-y-2">
              <div className="bg-black border-2 border-amber-500/20 text-amber-500/70 p-3 rounded-lg text-sm cursor-grab hover:border-amber-500/50 flex items-center gap-2">
                <GripVertical size={14} className="text-zinc-600"/> IF / ELSE Condition
              </div>
              <div className="bg-black border-2 border-purple-500/20 text-purple-500/70 p-3 rounded-lg text-sm cursor-grab hover:border-purple-500/50 flex items-center gap-2">
                <GripVertical size={14} className="text-zinc-600"/> Wait / Delay
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
