"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, ArrowRight, Package, Calendar, MapPin, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRfqExchangeStore } from "@/stores/rfqExchangeStore";

export default function ProcurementRfqHub() {
  const { rfqs, meta, isLoading, fetchRfqs } = useRfqExchangeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRfqs("tenant-1", currentPage, 10);
  }, [fetchRfqs, currentPage]);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DRAFT": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      case "CLOSED": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "AWARDED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Material Procurement</h1>
          <p className="text-zinc-400">Broadcast requirements to the Maal-Material Supplier Network.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={18} />
          Create New RFQ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active RFQs", value: "12", color: "text-green-400" },
          { label: "Quotes Received", value: "48", color: "text-blue-400" },
          { label: "Pending POs", value: "3", color: "text-amber-400" },
          { label: "Network Suppliers", value: "156", color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <p className="text-sm text-zinc-400 mb-2">{stat.label}</p>
            <p className={`text-4xl font-light ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* RFQ List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium">Recent Requests for Quotation</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search RFQs..." 
                className="bg-black border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-600 text-white"
              />
            </div>
            <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
              <Filter size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {isLoading ? (
            <div className="p-12 flex justify-center text-zinc-500">
              <Loader2 className="animate-spin text-purple-500 mr-2" size={24} /> Loading RFQs...
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              No RFQs found.
            </div>
          ) : rfqs.map((rfq: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={rfq.id} 
              className="p-6 hover:bg-zinc-800/50 transition-colors group flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium">{rfq.title || "Untitled RFQ"}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusBadge(rfq.status)}`}>
                    {rfq.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5"><Package size={14} /> {rfq.requirements || "Details pending"}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> Created: {new Date(rfq.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> Project: {rfq.projectId || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-light text-white">{rfq.bidsReceived || 0}</p>
                  <p className="text-xs text-zinc-500">Bids</p>
                </div>
                <Link href={`/procurement/rfq/${rfq.id}/cs`}>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <span className="text-sm text-zinc-500">
            {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={!!isLoading || currentPage === 1}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-zinc-400" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!!isLoading || !!(meta && currentPage >= meta.totalPages)}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Create RFQ Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-8 overflow-hidden"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-light mb-6">Broadcast New RFQ</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Material Specification</label>
                  <input type="text" placeholder="e.g. OPC 43 Grade Cement" className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Quantity</label>
                    <input type="number" placeholder="500" className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Unit</label>
                    <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600 appearance-none text-white">
                      <option>Bags</option>
                      <option>Tonnes</option>
                      <option>Cubic Meters</option>
                      <option>Pieces</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Project Delivery Site</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600 appearance-none text-white">
                    <option>PRJ-SKYLINE (Mumbai)</option>
                    <option>PRJ-GALAXY (Pune)</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-full text-zinc-400 hover:text-white font-medium">Cancel</button>
                  <button onClick={() => setIsModalOpen(false)} className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200">
                    Broadcast to Network
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
