"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, PackageOpen } from "lucide-react";

import { useProductsStore } from "../../../stores/productsStore";
import { EmptyState } from "@/components/ui/EmptyState";

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
                <span className="text-zinc-400">{c.price || `0.00`}</span>
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
          {commodities.length === 0 ? (
            <EmptyState icon={PackageOpen} title="No Market Data" description="Live commodity data is currently unavailable." />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">{commodities[0]?.name || commodities[0]?.title || "Market Index"}</h2>
                  <p className="text-3xl font-light text-white flex items-center gap-3">
                    {commodities[0]?.price || "N/A"} <span className="text-sm text-zinc-500">Live</span>
                  </p>
                </div>
                <div className="flex gap-2 bg-black border border-zinc-800 rounded-lg p-1">
                  <button className="px-3 py-1 text-xs font-medium rounded bg-zinc-800 text-white">1D</button>
                  <button className="px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white">1W</button>
                  <button className="px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white">1M</button>
                </div>
              </div>

              <div className="h-64 border-b border-zinc-800 mb-4 flex items-center justify-center text-zinc-500">
                No historical chart data available.
              </div>
              
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>09:00 AM</span>
                <span>12:00 PM</span>
                <span>03:00 PM</span>
              </div>
            </>
          )}
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-medium mb-4">Bulk Order Book</h3>
          
          <div className="flex-1 space-y-6">
            {commodities.length === 0 ? (
              <div className="text-zinc-500 text-sm">Order book empty.</div>
            ) : (
              <>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex justify-between"><span>Ask Price</span><span>Volume</span></p>
                  {commodities.slice(0, 3).map((row: any, i: number) => (
                    <div key={i} className="flex justify-between items-center mb-1 text-sm relative z-10 group">
                      <span className="text-red-400">{row.price}</span>
                      <span className="text-zinc-300">{row.volume || '-'} MT</span>
                    </div>
                  ))}
                </div>
                
                <div className="py-2 border-y border-zinc-800 flex justify-between items-center text-lg font-medium text-white">
                  <span>{commodities[0]?.price}</span>
                  <span className="text-xs text-zinc-500">Current Market</span>
                </div>

                <div>
                  {commodities.slice(3, 6).map((row: any, i: number) => (
                    <div key={i} className="flex justify-between items-center mb-1 text-sm relative z-10 group">
                      <span className="text-green-400">{row.price}</span>
                      <span className="text-zinc-300">{row.volume || '-'} MT</span>
                    </div>
                  ))}
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 flex justify-between"><span>Bid Price</span><span>Volume</span></p>
                </div>
              </>
            )}
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
