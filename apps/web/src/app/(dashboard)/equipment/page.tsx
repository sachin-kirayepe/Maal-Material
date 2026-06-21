"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Search, SlidersHorizontal, MapPin, Info, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEquipmentStore } from "@/stores/equipmentStore";

export default function EquipmentCatalog() {
  const { equipment, meta, isLoading, fetchEquipment } = useEquipmentStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEquipment("tenant-1", currentPage, 8);
  }, [fetchEquipment, currentPage]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Truck className="text-purple-500" size={28} /> Equipment Catalog
          </h1>
          <p className="text-zinc-400">Browse and rent heavy machinery from verified vendors.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search machinery..." 
              className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-purple-500 w-64"
            />
          </div>
          <button className="flex items-center justify-center bg-zinc-900 border border-zinc-800 text-white w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {["All", "Earthmoving", "Lifting", "Concreting", "Power & Generators"].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-purple-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border border-zinc-800 rounded-2xl bg-zinc-900/50">
          <Loader2 className="animate-spin text-purple-500 mr-2" size={32} /> Loading catalog...
        </div>
      ) : equipment.length === 0 ? (
        <div className="flex justify-center items-center h-64 border border-zinc-800 rounded-2xl bg-zinc-900/50 text-zinc-500">
          No equipment found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {equipment.filter((c: any) => activeCategory === "All" || c.category === activeCategory).map((item: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-purple-500/50 transition-colors"
              >
                {/* Fake Image Placeholder */}
                <div className="h-48 bg-zinc-950 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-800/50 transition-colors">
                  <Truck size={48} className="text-zinc-800 group-hover:text-purple-500/20 transition-colors" />
                  {item.status !== 'AVAILABLE' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm font-medium">Currently Rented Out</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{item.category}</span>
                    <button className="text-zinc-500 hover:text-white"><Info size={16}/></button>
                  </div>
                  <h3 className="font-medium text-lg text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4">By {item.vendor || "Maal-Material Vendor"}</p>
                  
                  <div className="mt-auto">
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mb-4"><MapPin size={12}/> {item.location || "N/A"}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Rental Rate</p>
                        <p className="text-lg font-medium text-white">₹{item.pricing?.[0]?.dailyRate?.toLocaleString() || "N/A"}<span className="text-xs text-zinc-500">/day</span></p>
                      </div>
                      <button 
                        disabled={item.status !== 'AVAILABLE'}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.status === 'AVAILABLE' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center py-4 border-t border-zinc-800/50">
            <span className="text-sm text-zinc-500">
              {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={isLoading || currentPage === 1}
                className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-zinc-400" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!!isLoading || !!(meta && currentPage >= (meta.totalPages || 1))}
                className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
