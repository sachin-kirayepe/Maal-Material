"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CheckCircle2, Search, ArrowRight, ShieldCheck, Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useReconciliationStore } from "@/stores/reconciliationStore";
export default function TreasurySettlements() {
  const { records, meta, loading, fetchReconciliations } = useReconciliationStore();
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReconciliations(currentPage, 10);
  }, [fetchReconciliations, currentPage]);

  const toggleSelection = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const totalSelectedAmount = records
    .filter((s: any) => selectedSuppliers.includes(s.id))
    .reduce((sum: number, s: any) => sum + (s.amountApplied || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Wallet className="text-purple-500" size={28} /> Bulk Settlements
          </h1>
          <p className="text-zinc-400">Manage treasury payouts and settle pending supplier invoices in bulk.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Settlement Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-medium">Pending Payouts</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search suppliers..." 
                  className="bg-black border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input 
                        type="checkbox" 
                        onChange={(e) => setSelectedSuppliers(e.target.checked ? records.map((s: any) => s.id) : [])}
                        checked={(selectedSuppliers.length === records.length && records.length > 0) || undefined}
                        className="rounded border-zinc-700 bg-black text-purple-500 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Invoices</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Amount Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                        Loading settlements...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        No pending payouts.
                      </td>
                    </tr>
                  ) : records.map((settlement: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      key={settlement.id} 
                      className={`transition-colors cursor-pointer ${selectedSuppliers.includes(settlement.id) ? 'bg-purple-500/5 hover:bg-purple-500/10' : 'hover:bg-zinc-800/30'}`}
                      onClick={() => toggleSelection(settlement.id)}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedSuppliers.includes(settlement.id)}
                          onChange={() => toggleSelection(settlement.id)}
                          className="rounded border-zinc-700 bg-black text-purple-500 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <Building2 size={16} className="text-zinc-500" /> Customer ID: {settlement.customerId.substring(0,8)}
                      </td>
                      <td className="px-6 py-4">{settlement.settlementNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${settlement.status === 'UNPAID' ? 'bg-red-500/10 text-red-400' : 'text-zinc-400'}`}>
                          {new Date(settlement.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-white">
                        ₹{settlement.amountApplied.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-b-2xl">
              <span className="text-sm text-zinc-500">
                {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={loading || currentPage === 1}
                  className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="text-zinc-400" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!!loading || !!(meta && currentPage >= (meta.totalPages || 1))}
                  className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} className="text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-28">
            <h3 className="text-lg font-medium mb-6">Payment Summary</h3>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400 text-sm">Selected Suppliers</span>
              <span className="font-medium text-white">{selectedSuppliers.length}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-400 text-sm">Total Invoices</span>
              <span className="font-medium text-white">
                {selectedSuppliers.length} Records
              </span>
            </div>

            <div className="pt-6 border-t border-zinc-800 mb-8">
              <p className="text-zinc-500 text-sm mb-1">Total Payout Amount</p>
              <p className="text-4xl font-light text-white">₹{totalSelectedAmount.toLocaleString()}</p>
            </div>

            <button 
              onClick={() => setIsConfirmOpen(true)}
              disabled={selectedSuppliers.length === 0}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                ${selectedSuppliers.length > 0 
                  ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
            >
              Initiate Bulk Payout <ArrowRight size={18} />
            </button>
            <p className="text-xs text-zinc-500 text-center mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Bank-grade encrypted transaction
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsConfirmOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8 text-center"
            >
              <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-medium mb-2">Confirm Authorization</h2>
              <p className="text-zinc-400 mb-8">
                You are authorizing a transfer of <strong>₹{totalSelectedAmount.toLocaleString()}</strong> from your primary HDFC Treasury account to {selectedSuppliers.length} supplier(s).
              </p>
              
              <div className="flex justify-center gap-4">
                <button onClick={() => setIsConfirmOpen(false)} className="px-6 py-3 rounded-full text-zinc-400 hover:text-white font-medium">Cancel</button>
                <button onClick={() => setIsConfirmOpen(false)} className="bg-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-400 flex items-center gap-2">
                  Authorize Payout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
