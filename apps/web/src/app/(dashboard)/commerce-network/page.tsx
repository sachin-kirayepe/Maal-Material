"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, Search, Link as LinkIcon, Building2, Store, Factory, ArrowRightLeft } from "lucide-react";

export default function CommerceNetwork() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Network className="text-purple-500" size={28} /> Commerce Network
          </h1>
          <p className="text-zinc-400">Visualize real-time B2B trade connections between suppliers, distributors, and buyers.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search network nodes..." 
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-purple-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Graph Mockup */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden h-[600px] flex items-center justify-center">
          {/* Fake Grid Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-20"></div>
          
          <div className="relative w-full h-full">
            {/* Center Node */}
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
              <div className="w-20 h-20 bg-purple-500/20 border-2 border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md">
                <Building2 size={32} className="text-purple-400" />
              </div>
              <p className="mt-2 text-sm font-medium text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-md border border-zinc-800">Maal-Material Hub</p>
            </motion.div>

            {/* Sub Node 1 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/50 rounded-full flex items-center justify-center backdrop-blur-md">
                <Factory size={24} className="text-blue-400" />
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-300">UltraTech Cement</p>
            </motion.div>

            {/* Sub Node 2 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/50 rounded-full flex items-center justify-center backdrop-blur-md">
                <Store size={24} className="text-amber-400" />
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-300">Metro Hardware</p>
            </motion.div>

            {/* Sub Node 3 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center backdrop-blur-md">
                <Factory size={24} className="text-green-400" />
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-300">Jindal Steel</p>
            </motion.div>

            {/* Fake SVG Lines linking nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 50% 50% L 25% 25%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
              <path d="M 50% 50% L 33% 75%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
              <path d="M 50% 50% L 75% 33%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
              {/* Data flow animations */}
              <circle cx="25%" cy="25%" r="4" fill="#60a5fa"><animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L 25% 25%" /></circle>
            </svg>
          </div>
        </div>

        {/* Network Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg">Ecosystem Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400"><Factory size={16}/> Active Manufacturers</div>
                <div className="text-xl font-medium">124</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400"><Store size={16}/> SMB Distributors</div>
                <div className="text-xl font-medium">850+</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-400"><ArrowRightLeft size={16}/> Monthly Transactions</div>
                <div className="text-xl font-medium text-purple-400">12.5k</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><LinkIcon size={18} className="text-purple-400"/> Recent Connections</h3>
            <div className="space-y-4">
              {[
                { from: "Project Alpha", to: "Metro Hardware", type: "Procurement Contract" },
                { from: "Jindal Steel", to: "Maal-Material Hub", type: "API Sync Established" },
              ].map((conn, i) => (
                <div key={i} className="bg-black border border-zinc-800 p-3 rounded-xl text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{conn.from}</span>
                    <ArrowRightLeft size={12} className="text-zinc-500" />
                    <span className="font-medium text-white">{conn.to}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{conn.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
