"use client";

import React, { useState } from "react";

import { BrainCircuit, Activity, Zap } from "lucide-react";

export default function IntelligenceEngine() {
  const [autoPo, setAutoPo] = useState(true);
  const [autoReroute, setAutoReroute] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="text-purple-500" size={28} /> AI Decision Engine
          </h1>
          <p className="text-zinc-400">Configure parameters for Maal-Material's autonomous decision-making agents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rules Config */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-lg flex items-center gap-2"><Zap className="text-yellow-500" size={20}/> Auto-Approve POs</h3>
                <p className="text-sm text-zinc-400 mt-1">Automatically approve low-risk Purchase Orders.</p>
              </div>
              <button onClick={() => setAutoPo(!autoPo)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoPo ? 'bg-purple-500' : 'bg-zinc-600'}`}>
                <span className={`${autoPo ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </button>
            </div>
            
            <div className={`space-y-4 transition-opacity ${autoPo ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div>
                <label className="text-xs text-zinc-400">Maximum Value Threshold (₹)</label>
                <input type="number" defaultValue={50000} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Minimum Vendor Trust Score</label>
                <input type="range" min="0" max="100" defaultValue="85" className="w-full mt-2 accent-purple-500" />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1"><span>0</span><span>85/100</span><span>100</span></div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-lg flex items-center gap-2"><Activity className="text-blue-500" size={20}/> Auto-Reroute Logistics</h3>
                <p className="text-sm text-zinc-400 mt-1">Automatically reroute trucks if delays exceed threshold.</p>
              </div>
              <button onClick={() => setAutoReroute(!autoReroute)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoReroute ? 'bg-purple-500' : 'bg-zinc-600'}`}>
                <span className={`${autoReroute ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </button>
            </div>
            
            <div className={`space-y-4 transition-opacity ${autoReroute ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div>
                <label className="text-xs text-zinc-400">Delay Threshold (Minutes)</label>
                <input type="number" defaultValue={45} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Log View */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-black/30">
            <h3 className="font-medium text-lg">Recent AI Decisions</h3>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="bg-black border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                <BrainCircuit size={14}/> Autonomous Action
              </div>
              <p className="text-sm font-medium text-white">Approved PO-8821 for ₹12,500</p>
              <p className="text-xs text-zinc-400 mt-1">Vendor (Metro Hardware) trust score is 92. Value under threshold.</p>
              <p className="text-[10px] text-zinc-600 mt-2">Today, 10:45 AM</p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                <BrainCircuit size={14}/> Autonomous Action
              </div>
              <p className="text-sm font-medium text-white">Rerouted TR-9941 (Cement Delivery)</p>
              <p className="text-xs text-zinc-400 mt-1">Detected severe traffic block on WEH. Sent via alternate route saving 35 mins.</p>
              <p className="text-[10px] text-zinc-600 mt-2">Yesterday, 14:20 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
