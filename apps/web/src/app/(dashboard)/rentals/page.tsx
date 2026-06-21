"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSignature, IndianRupee, Clock, ArrowUpRight, ShieldCheck, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRentalsStore } from "@/stores/rentalsStore";

export default function RentalDashboard() {
  const { bookings: activeRentals, meta, isLoading: loading, fetchBookings } = useRentalsStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings("tenant-1", currentPage, 5);
  }, [fetchBookings, currentPage]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <FileSignature className="text-purple-500" size={28} /> Rental Management
          </h1>
          <p className="text-zinc-400">Track active rental contracts, upcoming returns, and monthly rental expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-zinc-400 mb-2">Total Monthly Rental Expense</p>
          <p className="text-3xl font-medium mb-2 flex items-center gap-2"><IndianRupee size={24}/> 4.2 L</p>
          <p className="text-xs text-red-400 flex items-center gap-1"><ArrowUpRight size={12}/> +12% from last month</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-zinc-400 mb-2">Active Rental Contracts</p>
          <p className="text-3xl font-medium mb-2 text-white">{activeRentals.length}</p>
          <p className="text-xs text-zinc-500">Across 3 different projects</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
          <p className="text-sm text-amber-500 mb-2">Upcoming Returns (Next 7 Days)</p>
          <p className="text-3xl font-medium mb-2 text-amber-400">2</p>
          <button className="text-xs text-white bg-amber-500 px-3 py-1.5 rounded hover:bg-amber-400 transition-colors mt-1">Schedule Pickup</button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-medium">Active Rental Contracts</h2>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Contract ID</th>
              <th className="px-6 py-4">Equipment</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Rental Period</th>
              <th className="px-6 py-4 text-right">Total Cost (₹)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                  Loading rentals...
                </td>
              </tr>
            ) : activeRentals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-500">
                  No active rentals found.
                </td>
              </tr>
            ) : activeRentals.map((rc, i) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={rc.id} className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-purple-400">{rc.id}</td>
                <td className="px-6 py-4 font-medium text-white">{(rc as any).equipment?.name || "Equipment"}</td>
                <td className="px-6 py-4 flex items-center gap-2">{rc.contractorId || "Vendor"} <ShieldCheck size={14} className="text-blue-400"/></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-300">{new Date(rc.startDate).toLocaleDateString()}</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-zinc-300">{new Date(rc.endDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-white">{rc.totalAmount?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${rc.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {rc.status === 'APPROVED' ? <Clock size={12} /> : <AlertCircle size={12} />} {rc.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <span className="text-sm text-zinc-500">
            {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={!!loading || currentPage === 1}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-zinc-400" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!!loading || !!(meta && currentPage >= meta.totalPages)}
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
