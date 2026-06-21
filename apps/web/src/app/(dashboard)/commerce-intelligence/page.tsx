"use client";

import React from "react";
import { LineChart, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from "lucide-react";

export default function CommerceIntelligence() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <LineChart className="text-emerald-500" size={28} /> Market Price Trends
          </h1>
          <p className="text-zinc-400">Live analytics and historical charting for commodity prices like Steel, Cement, and Fuel.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition-colors">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Live Tickers */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
        {[
          { symbol: "TMT Rebar (8mm)", price: "₹52,400/MT", change: "+1.2%", up: true },
          { symbol: "OPC 53 Cement", price: "₹345/Bag", change: "-0.5%", up: false },
          { সংকট: "Diesel", price: "₹92.45/L", change: "0.0%", up: true },
          { symbol: "Bricks (Fly Ash)", price: "₹4.50/Pc", change: "+2.1%", up: true },
          { symbol: "Sand (River)", price: "₹3,200/Brass", change: "-1.8%", up: false },
        ].map((ticker, i) => (
          <div key={i} className="min-w-[200px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 shrink-0">
            <p className="text-zinc-400 text-xs font-medium mb-2">{ticker.symbol || ticker.সংকট}</p>
            <div className="flex justify-between items-end">
              <p className="text-lg font-medium">{ticker.price}</p>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${ticker.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {ticker.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {ticker.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-medium">TMT Rebar Index (National)</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">Live <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span></span>
            </div>
            <div className="flex bg-black border border-zinc-800 rounded-lg p-1 text-xs">
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1W</button>
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1M</button>
              <button className="px-3 py-1 rounded-md bg-zinc-800 text-white">3M</button>
              <button className="px-3 py-1 rounded-md text-zinc-400 hover:text-white">1Y</button>
            </div>
          </div>

          <div className="h-[400px] w-full relative pt-4">
            {/* Chart Simulation */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8">
              <div className="w-full border-t border-zinc-800/50 flex items-start justify-end text-[10px] text-zinc-600 pt-1">₹55,000</div>
              <div className="w-full border-t border-zinc-800/50 flex items-start justify-end text-[10px] text-zinc-600 pt-1">₹52,500</div>
              <div className="w-full border-t border-zinc-800/50 flex items-start justify-end text-[10px] text-zinc-600 pt-1">₹50,000</div>
              <div className="w-full border-t border-zinc-800/50 flex items-start justify-end text-[10px] text-zinc-600 pt-1">₹47,500</div>
            </div>
            <svg className="absolute inset-0 w-full h-full pb-8" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
              </defs>
              <path d="M0,250 L100,220 L200,240 L300,180 L400,200 L500,150 L600,170 L700,90 L800,110 L900,40 L1000,60 L1000,400 L0,400 Z" fill="url(#lineGrad)" />
              <path d="M0,250 L100,220 L200,240 L300,180 L400,200 L500,150 L600,170 L700,90 L800,110 L900,40 L1000,60" fill="none" stroke="#10b981" strokeWidth="3" />
            </svg>
            <div className="absolute bottom-2 w-full flex justify-between px-4 text-[10px] text-zinc-500">
              <span>Mar 01</span><span>Mar 15</span><span>Apr 01</span><span>Apr 15</span><span>May 01</span><span>May 15</span><span>Jun 01</span><span>Jun 15</span>
            </div>
          </div>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-500"/> AI Market Insights</h3>
            
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-sm font-medium text-white mb-2">Steel Prices Peaking</p>
                <p className="text-xs text-zinc-400">Based on global iron ore futures and local monsoon forecasts, TMT prices are expected to correct by <span className="text-emerald-400 font-medium">3-5%</span> in the next 15 days.</p>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-sm font-medium text-white mb-2">Cement Supply Chain</p>
                <p className="text-xs text-zinc-400">Local strikes in Maharashtra have caused a short-term artificial hike of ₹10/Bag. Hold bulk purchases until resolving.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
