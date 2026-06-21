"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Phone, Mail, Building2, ChevronRight, CheckCircle } from "lucide-react";

import { useVendorStore } from "../../../stores/vendorStore";

export default function SupplierDirectory() {
  const { vendors: suppliers, isLoading, fetchVendors } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-purple-500" size={28} /> Supplier Directory
          </h1>
          <p className="text-zinc-400">Manage your connected suppliers, view their profiles, and track relationship status.</p>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors">
          Add New Supplier
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
          <div className="flex gap-4 w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, category, or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white" 
              />
            </div>
            <button className="px-4 py-2 bg-black border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/80 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Supplier Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Primary Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading suppliers...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No suppliers found.</td></tr>
            ) : (
              suppliers.filter((s: any) => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.type || s.category || '').toLowerCase().includes(searchTerm.toLowerCase())).map((sup: any, i) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={sup.id} className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black border border-zinc-700 rounded flex items-center justify-center">
                      <Building2 size={18} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-base">{sup.name}</p>
                      <p className="text-xs text-zinc-500">ID: {sup.code || sup.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-xs">{sup.type || sup.category || "Supplier"}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white mb-1">{sup.contact || "N/A"}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1 hover:text-purple-400 transition-colors"><Phone size={12}/> {sup.phone || "-"}</span>
                    <span className="flex items-center gap-1 hover:text-purple-400 transition-colors"><Mail size={12}/> {sup.email || "-"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${sup.status === 'Active Partner' || sup.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {(sup.status === 'Active Partner' || sup.status === 'ACTIVE') && <CheckCircle size={12} />} {sup.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-600 group-hover:text-white transition-colors"><ChevronRight size={20}/></button>
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
