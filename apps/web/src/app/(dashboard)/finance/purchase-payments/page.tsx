"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileStack, CheckSquare, Square, Clock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useTreasuryStore } from "@/stores/treasuryStore";
import { useTenantId } from "@/hooks/useTenantId";
import { ApiClient } from "@/lib/api-client";

export default function AccountsPayable() {
  const tenantId = useTenantId();
  const { invoices: payables, isLoading, fetchInvoices } = useInvoiceStore();
  const { bankAccounts, fetchTreasuryData } = useTreasuryStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");

  React.useEffect(() => {
    fetchInvoices("PENDING");
    if (tenantId) fetchTreasuryData();
  }, [fetchInvoices, tenantId, fetchTreasuryData]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalSelected = payables.filter((p: any) => selected.includes(p.id)).reduce((acc: number, curr: any) => acc + (curr.amount || curr.totalAmount || 0), 0);

  const handleProcessPayment = async () => {
    if (selected.length === 0) return;
    setIsProcessing(true);
    try {
      // In a real batch processing, we would send the array of IDs. 
      // For this E2E validation demo, we iterate and pay each to the invoice endpoint.
      for (const id of selected) {
        await ApiClient.post(`/purchase-payments/invoices/${id}/pay`, { amount: totalSelected, account: selectedAccount || bankAccounts?.[0]?.accountNumber || "Unknown" });
      }
      toast.success(`Successfully processed payment for ${selected.length} invoices.`);
      setSelected([]);
      fetchInvoices("PENDING"); // Refresh the list
    } catch (e) {
      toast.error("Failed to process payment. Ensure sufficient balance or correct API endpoint.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <FileStack className="text-purple-500" size={28} /> Accounts Payable
          </h1>
          <p className="text-zinc-400">Process supplier invoices against approved Good Receipt Notes (GRN).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
              <h2 className="text-xl font-medium">Pending Invoices</h2>
              <span className="text-sm text-zinc-500">{payables.length} Unpaid</span>
            </div>
            
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-black/80 text-zinc-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">GRN Ref</th>
                  <th className="px-6 py-4 text-right">Amount ()</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-zinc-500">Loading invoices...</td></tr>
                ) : payables.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No pending invoices found.</td></tr>
                ) : (
                  payables.map((inv: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    key={inv.id} className={`transition-colors ${selected.includes(inv.id) ? 'bg-purple-500/5' : 'hover:bg-zinc-800/30'}`}
                    onClick={() => toggleSelect(inv.id)}
                  >
                    <td className="px-6 py-4 cursor-pointer">
                      {selected.includes(inv.id) ? <CheckSquare className="text-purple-500" size={18}/> : <Square className="text-zinc-600" size={18}/>}
                    </td>
                    <td className="px-6 py-4 font-mono text-white">{inv.invoiceNumber || inv.id}</td>
                    <td className="px-6 py-4 font-medium text-purple-400">{inv.vendor?.name || inv.supplier || "Unknown Supplier"}</td>
                    <td className="px-6 py-4 text-xs font-mono">{inv.grnNumber || inv.grn || "N/A"}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">{(inv.amount || inv.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${inv.status === 'OVERDUE' || inv.status === 'Overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {inv.status === 'OVERDUE' || inv.status === 'Overdue' ? <AlertCircle size={12} /> : <Clock size={12} />} {inv.due || inv.dueDate || "Pending"}
                      </span>
                    </td>
                  </motion.tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Processing Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
            <h3 className="font-medium mb-6 text-lg">Batch Payout</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Selected Invoices</span>
                <span className="text-white font-medium">{selected.length}</span>
              </div>
              <div className="h-px bg-zinc-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Payout</span>
                <span className="text-2xl font-light text-white">{totalSelected.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-zinc-400">Pay From Account</label>
              <select 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white mb-6 text-sm">
                {bankAccounts.length === 0 ? (
                  <option disabled>No accounts available</option>
                ) : (
                  bankAccounts.map((acc: any, i: number) => (
                    <option key={i} value={acc.accountNumber || acc.acc}>
                      {acc.bankName || acc.bank || 'Bank'} ({acc.accountNumber || acc.acc}) - Bal: {(acc.balance || 0).toLocaleString()}
                    </option>
                  ))
                )}
              </select>

              <button 
                onClick={handleProcessPayment}
                disabled={selected.length === 0 || isProcessing}
                className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${(selected.length > 0 && !isProcessing) ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <>Process Payment <ArrowRight size={18} /></>}
              </button>
              <p className="text-xs text-center text-zinc-500 mt-2">Payments are processed via connected banking APIs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
