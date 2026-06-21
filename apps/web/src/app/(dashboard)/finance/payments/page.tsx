"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, XCircle, Search, SlidersHorizontal, RefreshCcw } from "lucide-react";

import { useLedgerStore } from "@/stores/ledgerStore";

export default function PaymentGateway() {
  const { entries: transactions, isLoading, fetchLedgerEntries } = useLedgerStore();

  React.useEffect(() => {
    fetchLedgerEntries(1, 10);
  }, [fetchLedgerEntries]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <CreditCard className="text-purple-500" size={28} /> Payment Gateway
          </h1>
          <p className="text-zinc-400">View incoming payments, manage refunds, and monitor gateway health.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
          <button className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">Razorpay</button>
          <button className="text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Stripe</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Total Volume (Today)</p>
          <p className="text-3xl font-medium">₹1.75 L</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Success Rate</p>
          <p className="text-3xl font-medium text-green-400">98.2%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Gateway Status</p>
          <p className="text-3xl font-medium flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span> Operational</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium">Recent Transactions</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input type="text" placeholder="Search Txn ID..." className="bg-black border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white" />
            </div>
            <button className="p-2 bg-black border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-right">Amount (₹)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={7} className="py-8 text-center text-zinc-500">Loading transactions...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No transactions found.</td></tr>
            ) : (
              transactions.map((txn: any, i: number) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={txn.id || i} className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-purple-400">{txn.id?.slice(0,10) || `txn_${i}Xv...`}</td>
                <td className="px-6 py-4">{txn.date || new Date().toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-white">{txn.customer || txn.partyName || "Unknown"}</td>
                <td className="px-6 py-4">{txn.method || txn.paymentMethod || "Bank Transfer"}</td>
                <td className="px-6 py-4 text-right font-medium text-white">{txn.amount || txn.value || "0.00"}</td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${txn.status === 'Success' || txn.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {txn.status === 'Success' || txn.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {txn.status || "Success"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-zinc-500 hover:text-white" title="Initiate Refund"><RefreshCcw size={16} /></button>
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
