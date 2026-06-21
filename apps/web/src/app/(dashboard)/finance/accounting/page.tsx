"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Download, Plus, FileText, ArrowUpRight, ArrowDownRight, Briefcase, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useAccountingStore } from "@/stores/accountingStore";

export default function GeneralAccounting() {
  const { journals, meta, loading, fetchAccountingData } = useAccountingStore();
  const [activeTab, setActiveTab] = useState("Journal Entries");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAccountingData(currentPage, 10);
  }, [fetchAccountingData, currentPage]);

  const handleExport = async () => {
    try {
      toast.info("Queueing accounting export...");
      await ApiClient.post("/reports/generate", { templateId: "accounting-report", tenantId: "tenant-1" });
      toast.success("Job Queued: You will be notified when the export is ready.");
    } catch (e) {
      toast.error("Failed to queue export job.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Calculator className="text-purple-500" size={28} /> General Accounting
          </h1>
          <p className="text-zinc-400">Manage journal entries, balance sheets, and P&L statements.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors active:scale-95">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-2">
        {["Journal Entries", "Balance Sheet", "P&L Statement"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Panel */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-medium">Recent {activeTab}</h2>
            </div>
            
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Debit (₹)</th>
                  <th className="px-6 py-4 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                      Loading journals...
                    </td>
                  </tr>
                ) : journals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      No journals found.
                    </td>
                  </tr>
                ) : journals.map((row: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    key={row.id || i} className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">{new Date(row.entryDate).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-purple-400">{row.financialTransaction?.[0]?.generalLedgerAccount?.accountName || 'Multiple Accounts'}</td>
                    <td className="px-6 py-4">{row.description}</td>
                    <td className="px-6 py-4 text-right text-red-400">
                      {row.financialTransaction?.find((t:any) => t.type === 'DEBIT')?.amount?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-green-400">
                      {row.financialTransaction?.find((t:any) => t.type === 'CREDIT')?.amount?.toLocaleString() || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50 mt-4 rounded-b-2xl">
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

        {/* Analytics/Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Briefcase size={18} className="text-zinc-400"/> Account Balances</h3>
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">HDFC Current (Ending *4012)</p>
                  <p className="font-medium text-lg">₹42,50,000</p>
                </div>
                <ArrowUpRight className="text-green-400" />
              </div>
              <div className="bg-black border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Accounts Receivable</p>
                  <p className="font-medium text-lg">₹12,40,000</p>
                </div>
                <ArrowUpRight className="text-green-400" />
              </div>
              <div className="bg-black border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Accounts Payable</p>
                  <p className="font-medium text-lg">₹18,90,500</p>
                </div>
                <ArrowDownRight className="text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
            <FileText size={32} className="mx-auto text-purple-400 mb-3" />
            <h3 className="font-medium text-purple-300 mb-2">Month-End Close</h3>
            <p className="text-sm text-purple-400/70 mb-4">You have 14 un-reconciled transactions for May 2026.</p>
            <button className="bg-purple-500 text-white w-full py-2 rounded-xl font-medium hover:bg-purple-400 transition-colors">Start Reconciliation</button>
          </div>
        </div>
      </div>
    </div>
  );
}
