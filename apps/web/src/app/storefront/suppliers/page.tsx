"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ShieldCheck, Filter, Search, PhoneCall } from "lucide-react";

import { apiClient } from "@/lib/apiClient";

export default function VendorDiscovery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [suppliers, setSuppliers] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get('/shops');
        const apiData = response.data?.data?.items || response.data?.data || [];
        const mappedSuppliers = Array.isArray(apiData) ? apiData.map((shop: any) => ({
          id: shop.id,
          name: shop.name || "Unknown Supplier",
          type: shop.shopType || "Retailer",
          rating: 4.5, // Default for now
          reviews: 0,
          verified: shop.isActive || false,
          location: shop.address?.city || "Unknown Location",
          categories: ["General"], // Backend needs category mapping
          distance: "N/A"
        })) : [];
        setSuppliers(mappedSuppliers);
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-light text-white mb-4">Verified Supplier Directory</h1>
          <p className="text-zinc-400 max-w-2xl mb-8">
            Find and connect with top-rated building material suppliers, authorized dealers, and manufacturers in your region.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by supplier name, location, or GST number..." 
                className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 text-white"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-4 rounded-xl hover:bg-zinc-800 transition-colors">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="sticky top-28">
            <h3 className="font-medium text-white mb-4">Material Categories</h3>
            <ul className="space-y-2">
              {["All", "Cement", "Steel", "Aggregates", "Paints", "Plumbing", "Electrical"].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? 'bg-purple-500/20 text-purple-400 font-medium' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="font-medium text-white mt-8 mb-4">Supplier Type</h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <label className="flex items-center gap-3"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500" /> Authorized Dealer</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500" /> Manufacturer</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500" /> Wholesaler</label>
            </div>
          </div>
        </aside>

        {/* Directory List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-zinc-400 text-sm">Showing 124 suppliers near you</p>
            <select className="bg-transparent border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-zinc-600">
              <option className="bg-zinc-900">Sort by: Rating (High to Low)</option>
              <option className="bg-zinc-900">Sort by: Distance (Nearest)</option>
            </select>
          </div>

          <div className="space-y-4">
            {suppliers.filter(s => activeCategory === "All" || s.categories.includes(activeCategory)).map((supplier, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={supplier.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-medium text-white">{supplier.name}</h2>
                    {supplier.verified && (
                      <span className="text-blue-400 flex items-center gap-1 text-xs border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={14} /> Maal-Material Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mb-4">{supplier.type}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {supplier.location} ({supplier.distance})</span>
                    <span className="flex items-center gap-1.5 text-amber-400"><Star size={16} className="fill-amber-400" /> {supplier.rating} ({supplier.reviews} Reviews)</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {supplier.categories.map(cat => (
                      <span key={cat} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-700">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors">
                    View Catalog
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-zinc-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors">
                    <PhoneCall size={16} /> Contact
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
