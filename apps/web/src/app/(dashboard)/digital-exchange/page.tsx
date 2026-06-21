"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

import { useProductsStore } from "../../../stores/productsStore";

export default function DigitalExchange() {
  const { products: commodities, isLoading, fetchProducts } = useProductsStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BarChart3 className="text-purple-500" size={28} /> Commodity Digital Exchange
          </h1>
          <p className="text-zinc-400">Live trading rates, bulk procurement bidding, and market trends.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Market Open
        </div>
      </div>

      {/* Live Ticker */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-8 overflow-hidden flex gap-8 whitespace-nowrap overflow-x-auto hide-scrollbar">
        {isLoading ? (
          <div className="text-zinc-500 w-full text-center">Loading market data...</div>
        ) : commodities.length === 0 ? (
          <div className="text-zinc-500 w-full text-center">No commodity data available.</div>
        ) : (
          commodities.map((c: any, i) => {
            const isUp = c.isUp ?? true;
            const change = c.change || (isUp ? '+0.0%' : '-0.0%');
            return (
              <div key={c.id || i} className="flex items-center gap-3 shrink-0">
                <span className="font-medium text-white">{c.name || c.title || "Commodity"}</span>
                <span className="text-zinc-400">{c.price || `₹0.00`}</span>
                <span className={`text-xs flex items-center gap-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {change}
                </span>
                {i !== commodities.length - 1 && <span className="text-zinc-700 ml-4">|</span>}
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-medium mb-1">TMT Steel Rebar (8mm)</h2>
              <p className="text-3xl font-light text-white flex items-center gap-3">
                ₹62,500 <span className="text-sm text-red-400 flex items-center gap-1"><TrendingDown size={16}/> -0.8% (₹500)</span>
              </p>
            </div>
            <div className="flex gap-2 bg-black border border-zinc-800 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium rounded bg-zinc-800 text-white">1D</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white">1W</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white">1M</button>
            </div>
          </div>

          <div className="h-64 border-b border-zinc-800 mb-4 relative flex items-end">
            {/* Fake Candlestick Chart */}
            <div className="w-full h-full absolute inset-0 flex items-end justify-between px-4 pb-2">
              {[40, 50, 45, 60, 55, 70, 65, 80, 75, 85, 70, 75].map((h, i) => (
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }} key={i} className="w-4 relative flex justify-center">
                  <div className={`w-0.5 h-full absolute ${i % 2 === 0 ? 'bg-green-500/50' : 'bg-red-500/50'}`}></div>
                  <div className={`w-full absolute top-1/4 bottom-1/4 rounded-sm ${i % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>09:00 AM</span>
            <span>12:00 PM</span>
            <span>03:00 PM</span>
          </div>
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-medium mb-4">Bulk Order Book</h3>
          
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex justify-between"><span>Ask Price</span><span>Volume</span></p>
              {[
                { p: "62,600", v: "50 MT", bar: "40%" },
                { p: "62,550", v: "120 MT", bar: "70%" },
                { p: "62,520", v: "80 MT", bar: "50%" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center mb-1 text-sm relative z-10 group">
                  <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 -z-10 group-hover:bg-red-500/20 transition-colors" style={{ width: row.bar }}></div>
                  <span className="text-red-400">{row.p}</span>
                  <span className="text-zinc-300">{row.v}</span>
                </div>
              ))}
            </div>
            
            <div className="py-2 border-y border-zinc-800 flex justify-between items-center text-lg font-medium text-white">
              <span>62,500</span>
              <span className="text-xs text-zinc-500">Current Market</span>
            </div>

            <div>
              {[
                { p: "62,480", v: "200 MT", bar: "90%" },
                { p: "62,450", v: "150 MT", bar: "60%" },
                { p: "62,400", v: "40 MT", bar: "30%" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center mb-1 text-sm relative z-10 group">
                  <div className="absolute right-0 top-0 bottom-0 bg-green-500/10 -z-10 group-hover:bg-green-500/20 transition-colors" style={{ width: row.bar }}></div>
                  <span className="text-green-400">{row.p}</span>
                  <span className="text-zinc-300">{row.v}</span>
                </div>
              ))}
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 flex justify-between"><span>Bid Price</span><span>Volume</span></p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-400 transition-colors">Buy Bulk</button>
            <button className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-400 transition-colors">Sell Bulk</button>
          </div>
        </div>
      </div>
    </div>
  );
}
