"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Star, CheckCircle, Package, Building2 } from "lucide-react";

import { useVendorStore } from "../../../stores/vendorStore";

export default function VendorDiscovery() {
  const [query, setQuery] = useState("Cement");
  const { vendors: results, isLoading, fetchVendors } = useVendorStore();

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      
      {/* Search Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 text-center relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
        
        <h1 className="text-3xl font-light tracking-tight text-white mb-6">Discover Verified Suppliers</h1>
        
        <div className="max-w-3xl mx-auto flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for? (e.g. TMT Steel, Cement, Tiles)" 
              className="w-full bg-black border border-zinc-700 text-white pl-12 pr-4 py-4 rounded-xl text-lg focus:outline-none focus:border-purple-500 shadow-xl"
            />
          </div>
          <div className="w-48 relative hidden md:block">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Location" 
              defaultValue="Mumbai"
              className="w-full bg-black border border-zinc-700 text-white pl-12 pr-4 py-4 rounded-xl text-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <button className="bg-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-purple-400 transition-colors text-lg shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 font-medium mb-6 pb-4 border-b border-zinc-800"><Filter size={18}/> Filters</div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3">Supplier Type</h4>
                <div className="space-y-2">
                  {["Manufacturer", "Wholesaler / Distributor", "Retailer", "Importer"].map(t => (
                    <label key={t} className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-purple-500" /> {t}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3">Verification Status</h4>
                <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-purple-500" defaultChecked /> 
                  Maal-Material Verified Only
                </label>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3">Minimum Rating</h4>
                <div className="flex gap-2">
                  {[].map(r => (
                    <button key={r} className="flex-1 bg-black border border-zinc-800 py-1.5 rounded text-sm text-zinc-400 hover:border-purple-500 hover:text-white transition-colors flex justify-center items-center gap-1">
                      {r}+ <Star size={12}/>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-4">
          <p className="text-sm text-zinc-500 mb-4">Showing {results.length} results for "{query}" in Mumbai</p>
          
          {isLoading ? (
            <div className="p-12 text-center text-zinc-500">Searching vendor network...</div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No vendors found matching your criteria.</div>
          ) : (
            results.map((r: any, i) => (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={r.id || i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-6">

                  <div className="w-20 h-20 bg-black border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Building2 size={32} className="text-zinc-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white flex items-center gap-2">
                      {r.name || r.companyName || "Vendor Name"}
                      {(r.verified || r.status === 'VERIFIED') && <CheckCircle className="text-blue-500" size={18} />}
                    </h3>
                    <div className="flex items-center gap-4 text-sm mt-1 mb-3">
                      <span className="text-zinc-400">{r.type || r.category || "Supplier"}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-amber-400 flex items-center gap-1"><Star size={14} className="fill-amber-400"/> {r.rating || 4.5}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 flex items-center gap-1"><MapPin size={14}/> {r.location || "Multiple"}</span>
                    </div>
                    
                    <div className="bg-black/50 border border-zinc-800/50 rounded-lg p-3 inline-block">
                      <p className="text-sm font-medium text-purple-300 flex items-center gap-2"><Package size={14}/> {r.product || r.primaryProduct || "Construction Materials"}</p>
                      <p className="text-xs text-zinc-500 mt-1">Price Idea: <span className="text-white">{r.price || "Contact for Quote"}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="bg-white text-black px-6 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors">View Profile</button>
                  <button className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-6 py-2 rounded-lg font-medium text-sm hover:bg-purple-500 hover:text-white transition-colors">Request Quote</button>
                </div>
              </div>
            </motion.div>
          )))}
        </div>
      </div>
    </div>
  );
}
