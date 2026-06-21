"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, Warehouse, ArrowRight } from "lucide-react";

import { useSupplyChainStore } from "@/stores/supplyChainStore";

export default function SupplyChainMap() {
  const { logistics, isLoading, fetchLogistics } = useSupplyChainStore();

  React.useEffect(() => {
    fetchLogistics("tenant-1");
  }, [fetchLogistics]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Network className="text-purple-500" size={28} /> Supply Chain Network
          </h1>
          <p className="text-zinc-400">End-to-end visibility from manufacturers to your construction sites.</p>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors">
          Optimize Routes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Suppliers", value: "124" },
          { label: "Material in Transit", value: "₹45.2L" },
          { label: "Avg Lead Time", value: "2.4 Days" },
          { label: "Network Health", value: "94%" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-sm text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
        <h2 className="text-xl font-medium mb-12 relative z-10">Live Logistics Flow</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 w-full overflow-x-auto pb-4">
          {isLoading ? (
            <div className="w-full text-center text-zinc-500 py-12">Loading logistics routes...</div>
          ) : logistics.length === 0 ? (
            <div className="w-full text-center text-zinc-500 py-12 border border-dashed border-zinc-800">No logistics routes found.</div>
          ) : (
            logistics.map((node: any, i: number) => (
            <React.Fragment key={node.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                className="bg-black border border-zinc-800 p-6 rounded-2xl w-full md:min-w-[250px] relative group hover:border-purple-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300 mb-4 group-hover:text-purple-400 transition-colors">
                  <Warehouse size={24} />
                </div>
                <p className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-1">Route {node.referenceId}</p>
                <h3 className="font-medium text-white mb-2">{node.origin}</h3>
                <p className="text-sm text-zinc-500">To: {node.destination}</p>
                <div className={`mt-4 text-xs font-medium px-2.5 py-1 rounded-full w-fit border ${node.status === 'Active' || node.status === 'DISPATCHED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {node.status}
                </div>
              </motion.div>

              {i < logistics.length - 1 && (
                <div className="hidden md:flex flex-1 min-w-[50px] items-center justify-center text-zinc-700">
                  <motion.div
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.2 + 0.1, duration: 0.5 }}
                    className="w-full h-px bg-gradient-to-r from-zinc-800 via-purple-500/50 to-zinc-800 relative flex items-center justify-center"
                  >
                    <div className="bg-black p-1 rounded-full"><ArrowRight size={16} className="text-purple-500" /></div>
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          )))}
        </div>
      </div>
    </div>
  );
}
