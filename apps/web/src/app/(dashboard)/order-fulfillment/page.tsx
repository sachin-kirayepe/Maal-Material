"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, ScanLine, Printer, CheckCircle2, ArrowRight } from "lucide-react";

export default function OrderFulfillment() {
  const [scanned, setScanned] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Package className="text-blue-500" size={28} /> Warehouse Order Fulfillment
          </h1>
          <p className="text-zinc-400">Scan, pack, and generate shipping labels for outbound deliveries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scanner Area */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            {scanned ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-medium mb-1">Order #PO-8821 Scanned</h2>
                <p className="text-zinc-400">Ready for picking and packing.</p>
                <button onClick={() => setScanned(false)} className="mt-6 text-sm text-blue-400 hover:text-blue-300">Scan Another Order</button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <ScanLine size={64} className="text-blue-500" />
                  <motion.div animate={{ y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-2 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></motion.div>
                </div>
                <h2 className="text-xl font-medium mb-2">Awaiting Barcode Scan</h2>
                <p className="text-zinc-400 text-sm mb-6">Use your handheld scanner or enter the PO number manually below.</p>
                
                <div className="flex gap-2 w-full max-w-sm">
                  <input type="text" placeholder="Enter PO Number..." className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  <button onClick={() => setScanned(true)} className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-400 transition-colors">Load</button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-sm text-zinc-400 mb-2">Orders Pending Packing</p>
              <p className="text-3xl font-medium">14</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-sm text-zinc-400 mb-2">Packed Today</p>
              <p className="text-3xl font-medium text-green-400">42</p>
            </div>
          </div>
        </div>

        {/* Packing Checklist & Print */}
        <div className={`transition-opacity duration-500 ${scanned ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'}`}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-medium text-white">Packing List: PO-8821</h3>
                <p className="text-sm text-zinc-400 mt-1">Destination: Project Alpha (BKC, Mumbai)</p>
              </div>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20 uppercase tracking-widest">Priority</span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {[
                { name: "Asian Paints Apex (20L)", qty: "5 Buckets", sku: "PNT-APX-20", picked: true },
                { name: "Asian Paints Primer (10L)", qty: "2 Buckets", sku: "PNT-PRM-10", picked: true },
                { name: "Painting Brushes (Set of 4)", qty: "10 Sets", sku: "TLS-BRS-04", picked: false },
                { name: "Masking Tape (2 inch)", qty: "20 Rolls", sku: "TLS-MTP-02", picked: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.picked ? 'bg-green-500/5 border-green-500/20' : 'bg-black border-zinc-800'}`}>
                  <div className="flex items-center gap-4">
                    <button className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.picked ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-600 text-transparent hover:border-blue-500'}`}>
                      <CheckCircle2 size={16} />
                    </button>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{item.qty}</p>
                    <span className={`text-[10px] uppercase tracking-widest ${item.picked ? 'text-green-400' : 'text-zinc-500'}`}>{item.picked ? 'Picked' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-4">
              <button className="flex-1 bg-black border border-zinc-700 text-white py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> Print E-Way Bill & Labels
              </button>
              <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-400 transition-colors flex items-center justify-center gap-2">
                Mark as Ready to Ship <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
