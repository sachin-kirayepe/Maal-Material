"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Search, Filter, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Building2, Plus, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useLedgerStore } from "@/stores/ledgerStore";

export default function GeneralLedger() {
  const { entries, meta, fetchLedgerEntries, createEntry, isLoading } = useLedgerStore();
  const [activeTab, setActiveTab] = useState("All Accounts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ledgerAccountId: "ACC-TEST-1", description: "", amount: "", type: "DEBIT" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLedgerEntries(currentPage, 10);
  }, [fetchLedgerEntries, currentPage]);

  const handleExport = async () => {
    try {
      toast.info("Queueing ledger export...");
      await ApiClient.post("/reports/generate", { templateId: "ledger-report", tenantId: "tenant-1" });
      toast.success("Job Queued: You will be notified when the export is ready.");
    } catch (e) {
      toast.error("Failed to queue export job.");
    }
  };

  const handleSubmit = async () => {
    try {
      await createEntry({ ...formData, amount: parseFloat(formData.amount) || 0 });
      setIsModalOpen(false);
      setFormData({ ledgerAccountId: "ACC-TEST-1", description: "", amount: "", type: "DEBIT" });
      fetchLedgerEntries(1, 10);
      setCurrentPage(1);
    } catch (e) {
      alert("Failed to create entry");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-purple-500" size={28} /> General Ledger
          </h1>
          <p className="text-zinc-400">Track all journal entries, debits, credits, and account balances.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors active:scale-95">
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 border border-purple-500 text-white px-6 py-2.5 rounded-full hover:bg-purple-500 transition-colors">
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Assets", value: "₹45,20,000", icon: <Building2 size={20} className="text-blue-400" />, trend: "+2.4%" },
          { label: "Accounts Payable", value: "₹12,45,000", icon: <TrendingUp size={20} className="text-red-400" />, trend: "+15%" },
          { label: "Accounts Receivable", value: "₹8,50,000", icon: <TrendingDown size={20} className="text-green-400" />, trend: "-5%" },
          { label: "Bank Balance", value: "₹32,15,500", icon: <BookOpen size={20} className="text-purple-400" />, trend: "+1.2%" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-zinc-500">{stat.trend}</span>
            </div>
            <p className="text-sm text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {["All Accounts", "Assets", "Liabilities", "Equity", "Revenue", "Expenses"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-white text-black' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="w-full bg-black border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-600 text-white"
              />
            </div>
            <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
              <Filter size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4 text-right">Debit (Dr)</th>
                <th className="px-6 py-4 text-right">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                    Loading entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No entries found.
                  </td>
                </tr>
              ) : (
                entries.map((entry: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={entry.id} 
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-white">{entry.ledgerAccount?.accountName || 'Unknown Account'}</td>
                    <td className="px-6 py-4">{entry.description}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{entry.referenceId || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      {entry.debit > 0 ? (
                        <span className="text-white flex items-center justify-end gap-1"><ArrowDownRight size={14} className="text-zinc-500"/> ₹{entry.debit.toLocaleString()}</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {entry.credit > 0 ? (
                        <span className="text-white flex items-center justify-end gap-1"><ArrowUpRight size={14} className="text-zinc-500"/> ₹{entry.credit.toLocaleString()}</span>
                      ) : '-'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
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
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Plus className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">New Journal Entry</h2>
                <p className="text-sm text-zinc-400 mt-1">Record a manual debit or credit</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Payment received..." className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 appearance-none text-white">
                    <option value="DEBIT">Debit (Dr)</option>
                    <option value="CREDIT">Credit (Cr)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full text-zinc-400 hover:text-white font-medium transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading} className="bg-purple-500 text-white px-8 py-2 rounded-full font-medium hover:bg-purple-400 transition-colors disabled:opacity-50">
                  {isLoading ? "Saving..." : "Record Entry"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
