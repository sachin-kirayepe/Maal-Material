"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Hash, ClipboardCheck, QrCode, ShieldAlert, BadgeCheck, CheckCircle2 } from "lucide-react";

export default function OrderItemTracking() {
  const [selectedTab, setSelectedTab] = useState("specs");

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
          <Box className="text-blue-500" size={28} /> Detailed Item Tracking
        </h1>
        <p className="text-zinc-400">Deep dive into specific line-items, serial numbers, batch codes, and QC pass statuses.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Item Core Details */}
        <div className="md:w-1/3 border-r border-zinc-800 p-8 flex flex-col">
          <div className="flex-1">
            <div className="w-full aspect-square bg-black border border-zinc-800 rounded-xl flex items-center justify-center mb-6 relative group overflow-hidden">
              <Box size={64} className="text-zinc-700 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-medium flex items-center gap-1">
                <BadgeCheck size={12}/> QC Passed
              </div>
            </div>

            <h2 className="text-2xl font-medium text-white mb-2">ABB Electrical Panel Board</h2>
            <p className="text-sm text-zinc-400 mb-6">415V, 3-Phase, IP65 Rated Distribution Board.</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500 flex items-center gap-2"><Hash size={14}/> Serial No.</span>
                <span className="text-sm font-mono text-white">ABB-DB-88192A</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500 flex items-center gap-2"><QrCode size={14}/> Batch Code</span>
                <span className="text-sm font-mono text-white">BTCH-2026-05</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500">Manufacturer</span>
                <span className="text-sm text-white">ABB India Ltd</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Warranty Exp</span>
                <span className="text-sm text-white">10 Jun, 2028</span>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-8 bg-zinc-800 text-white py-3 rounded-xl font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
            <ShieldAlert size={16}/> Report Defect
          </button>
        </div>

        {/* Interactive Tabs Area */}
        <div className="md:w-2/3 flex flex-col bg-[#0a0a0a]">
          <div className="flex border-b border-zinc-800 px-8 pt-6">
            <button 
              onClick={() => setSelectedTab('specs')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'specs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-white'}`}
            >Technical Specs</button>
            <button 
              onClick={() => setSelectedTab('qc')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'qc' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-white'}`}
            >QC & Compliance</button>
            <button 
              onClick={() => setSelectedTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-white'}`}
            >Movement History</button>
          </div>

          <div className="flex-1 p-8">
            {selectedTab === 'specs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-medium text-lg mb-4">Electrical Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Voltage Rating", value: "415V AC" },
                    { label: "Current Rating", value: "250 Amps" },
                    { label: "Phases", value: "3 Phase, 4 Wire" },
                    { label: "IP Rating", value: "IP 65 (Weatherproof)" },
                    { label: "Material", value: "CRCA Sheet Steel 1.6mm" },
                    { label: "Dimensions", value: "800x600x250 mm" },
                  ].map((s, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                      <p className="text-sm font-medium text-white">{s.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'qc' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2"><ClipboardCheck size={20} className="text-green-500"/> Quality Control Log</h3>
                
                <div className="space-y-3">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">Visual Inspection (No Transit Damage)</p>
                      <p className="text-xs text-zinc-500 mt-1">Checked by: Ramesh (Warehouse)</p>
                    </div>
                    <span className="text-green-500"><CheckCircle2 size={18}/></span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">Insulation Resistance Test</p>
                      <p className="text-xs text-zinc-500 mt-1">Factory Certified - &gt;100 MΩ</p>
                    </div>
                    <span className="text-green-500"><CheckCircle2 size={18}/></span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">IP Rating Water Test</p>
                      <p className="text-xs text-zinc-500 mt-1">Factory Certified</p>
                    </div>
                    <span className="text-green-500"><CheckCircle2 size={18}/></span>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-medium text-lg mb-6">Item Lineage</h3>
                
                <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-black"></div>
                    <p className="text-sm font-medium text-white">Received at Bhiwandi Central Hub</p>
                    <p className="text-xs text-zinc-500 mt-1">10 Jun 2026, 08:30 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-zinc-700 border-4 border-black"></div>
                    <p className="text-sm font-medium text-white">Dispatched from Manufacturer (ABB)</p>
                    <p className="text-xs text-zinc-500 mt-1">08 Jun 2026, 04:15 PM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-zinc-700 border-4 border-black"></div>
                    <p className="text-sm font-medium text-white">Manufactured & QC Passed</p>
                    <p className="text-xs text-zinc-500 mt-1">05 Jun 2026, 11:00 AM</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
