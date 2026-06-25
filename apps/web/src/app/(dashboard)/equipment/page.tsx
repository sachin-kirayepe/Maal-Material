"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, MapPin, ArrowRight, Loader2, Star,
  ShieldCheck, ArrowUpRight, Tractor, Heart
} from "lucide-react";
import { useEquipmentStore } from "@/stores/equipmentStore";
import { Button } from "@constructos/ui";
import Link from "next/link";
import { EquipmentSearchSidebar } from "@/components/equipment/EquipmentSearchSidebar";

export default function MarketplaceHome() {
  const { equipment, isLoading, fetchEquipment } = useEquipmentStore();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchEquipment("tenant-1", 1, 20); // Fetch more for marketplace
  }, [fetchEquipment]);

  const categories = [
    { name: "All", icon: "🚜" },
    { name: "EXCAVATOR", icon: "🏗️" },
    { name: "JCB", icon: "🚧" },
    { name: "CRANE", icon: "🏗️" },
    { name: "BULLDOZER", icon: "🚜" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row">
      
      {/* Advanced Search Sidebar */}
      <div className="w-full md:w-80 shrink-0 border-r border-zinc-800/50 bg-zinc-950/50 hidden md:block">
        <EquipmentSearchSidebar />
      </div>

      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header / Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent p-8 mb-10 border border-amber-500/20">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Find the right <span className="text-amber-500">machine</span> for your site.
            </h1>
            <p className="text-zinc-400 text-lg mb-8">
              Rent heavy equipment directly from verified fleet owners. Zero hassle, instant booking.
            </p>
            
            <div className="flex bg-zinc-900/80 backdrop-blur-md rounded-2xl p-2 border border-zinc-700/50 max-w-xl">
              <div className="flex-1 flex items-center px-4 gap-3 border-r border-zinc-700/50">
                <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                <input type="text" placeholder="Search JCB, Excavator..." className="w-full bg-transparent border-none focus:outline-none text-white placeholder-zinc-500" />
              </div>
              <div className="flex-1 flex items-center px-4 gap-3">
                <MapPin className="w-5 h-5 text-zinc-500 shrink-0" />
                <input type="text" placeholder="Location..." className="w-full bg-transparent border-none focus:outline-none text-white placeholder-zinc-500" />
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-8 rounded-xl shrink-0">
                Search
              </Button>
            </div>
          </div>
          <Tractor className="absolute -bottom-10 -right-10 w-64 h-64 text-amber-500/10 -rotate-12" />
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Popular Categories</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="font-semibold">{cat.name.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Featured Machinery</h2>
            <Link href="/equipment/all" className="text-amber-500 hover:underline text-sm font-medium flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 border border-zinc-800/50 rounded-3xl bg-zinc-900/20">
              <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
          ) : equipment.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 border border-zinc-800/50 rounded-3xl bg-zinc-900/20 text-zinc-500">
              <Tractor className="w-12 h-12 mb-4 text-zinc-700" />
              <p>No machines found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {equipment
                .filter((item: any) => activeCategory === "All" || item.category === activeCategory)
                .map((item: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl overflow-hidden flex flex-col group hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all shadow-xl"
                >
                  <div className="relative h-56 bg-zinc-950 flex items-center justify-center p-6">
                    <Tractor size={80} className="text-zinc-800 group-hover:text-amber-500/20 group-hover:scale-110 transition-all duration-500" />
                    
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.category.replace("_", " ")}
                      </span>
                      {item.status !== 'AVAILABLE' && (
                        <span className="bg-rose-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          RENTED OUT
                        </span>
                      )}
                    </div>
                    
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                      <Heart className="w-4 h-4 text-zinc-400 hover:text-rose-500 transition-colors" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" /> 4.8
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Owner • 
                      <MapPin className="w-3 h-3 ml-1" /> {item.location || "Mumbai"}
                    </div>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <div>
                        <p className="text-xs text-zinc-500 font-medium mb-1">Rental Rate</p>
                        <p className="text-2xl font-bold text-white">₹{item.pricing?.dailyRate?.toLocaleString() || "12,000"} <span className="text-sm text-zinc-500 font-normal">/day</span></p>
                      </div>
                      
                      <Link href={`/equipment/${item.id}`}>
                        <Button 
                          disabled={item.status !== 'AVAILABLE'}
                          className={`rounded-xl px-6 font-bold shadow-lg transition-all ${
                            item.status === 'AVAILABLE' 
                            ? 'bg-white text-zinc-950 hover:bg-amber-500 hover:text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                            : 'bg-zinc-800 text-zinc-600'
                          }`}
                        >
                          {item.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
