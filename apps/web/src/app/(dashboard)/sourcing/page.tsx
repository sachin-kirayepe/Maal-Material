"use client";

import React from "react";
import { Globe, Plane, Anchor, FileText, CheckCircle2, Clock } from "lucide-react";

export default function GlobalSourcing() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Globe className="text-purple-500" size={28} /> Global Sourcing Portal
          </h1>
          <p className="text-zinc-400">Manage international imports, track sea/air freight, and handle customs documentation.</p>
        </div>
        <button className="bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
          Create Import Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Shipments */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-medium mb-4">Active International Shipments</h2>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-widest flex items-center gap-1"><Anchor size={14}/> Sea Freight</span>
                  <span className="text-zinc-500 text-sm font-mono">AWB: MSCU-8819203</span>
                </div>
                <h3 className="text-lg font-medium text-white">Italian Marble Slabs (2 Containers)</h3>
                <p className="text-sm text-zinc-400">Supplier: Verona Stone Co, Italy</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">ETA: Nhava Sheva Port</p>
                <p className="font-medium text-white">24 Jun, 2026</p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative mt-8 mb-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-[60%] h-0.5 bg-purple-500 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 border-4 border-zinc-900 z-10"></div>
                  <p className="text-xs text-purple-400 mt-2 font-medium">Order Placed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 border-4 border-zinc-900 z-10"></div>
                  <p className="text-xs text-purple-400 mt-2 font-medium">Loaded (Genoa)</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 border-4 border-zinc-900 z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  <p className="text-xs text-white mt-2 font-medium">In Transit (Suez Canal)</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border-4 border-zinc-900 z-10"></div>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Customs</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border-4 border-zinc-900 z-10"></div>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 opacity-60">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-widest flex items-center gap-1"><Plane size={14}/> Air Freight</span>
                  <span className="text-zinc-500 text-sm font-mono">AWB: EK-1029</span>
                </div>
                <h3 className="text-lg font-medium text-white">HVAC Control Boards (12 units)</h3>
                <p className="text-sm text-zinc-400">Supplier: TechFlow Germany</p>
              </div>
              <div className="text-right">
                <span className="flex items-center justify-end gap-1 text-sm text-green-500 mb-1"><CheckCircle2 size={16}/> Delivered</span>
                <p className="text-sm text-zinc-500">10 Jun, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customs & Docs Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg flex items-center gap-2"><FileText size={18} className="text-purple-400"/> Required Documents</h3>
            
            <div className="space-y-3">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-white text-sm">Commercial Invoice</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1"><CheckCircle2 size={12}/> Verified</p>
                </div>
                <button className="text-zinc-500 hover:text-white text-sm">View</button>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-white text-sm">Bill of Lading</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1"><CheckCircle2 size={12}/> Verified</p>
                </div>
                <button className="text-zinc-500 hover:text-white text-sm">View</button>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-400 text-sm">Customs Declaration (Bill of Entry)</p>
                  <p className="text-xs text-red-400/70 flex items-center gap-1 mt-1"><Clock size={12}/> Action Required</p>
                </div>
                <button className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-400">Upload</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
