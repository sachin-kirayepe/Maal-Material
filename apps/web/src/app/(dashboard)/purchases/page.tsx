"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Download, Search, Filter, CheckCircle2, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useProcurementStore } from "../../../stores/procurementStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function PurchaseHistory() {
  const tenantId = useTenantId();
  const { purchaseOrders: purchases, isLoading, fetchPurchaseOrders } = useProcurementStore();
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const totalSpend = purchases.reduce((acc: number, p: any) => acc + (p.totalAmount || p.amount || 0), 0);
  const activeSuppliers = new Set(purchases.map((p: any) => p.vendor?.name || p.supplier).filter(Boolean)).size;
  const pendingDeliveries = purchases.filter((p: any) => p.status === 'Pending' || p.status === 'In Transit' || p.status === 'SHIPPED').length;

  const handleExport = async () => {
    try {
      toast.info("Queueing purchase history export...");
      await ApiClient.post("/reports/generate", { templateId: "purchase-history", tenantId: tenantId });
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
            <ShoppingBag className="text-purple-500" size={28} /> Purchase History
          </h1>
          <p className="text-zinc-400">Track all your past orders, download invoices, and reorder materials.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors active:scale-95">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-zinc-400 mb-2">Total Spend (YTD)</p>
          <p className="text-2xl font-medium text-white">{isLoading ? "—" : `${totalSpend.toLocaleString()}`}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-zinc-400 mb-2">Total Orders</p>
          <p className="text-2xl font-medium text-white">{isLoading ? "—" : purchases.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm text-zinc-400 mb-2">Active Suppliers</p>
          <p className="text-2xl font-medium text-white">{isLoading ? "—" : activeSuppliers}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
          <p className="text-sm text-purple-400 mb-2">Pending Deliveries</p>
          <p className="text-2xl font-medium text-purple-300">{isLoading ? "—" : pendingDeliveries}</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
          <div className="flex gap-4 w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search PO Number or Supplier..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white" 
              />
            </div>
            <button className="px-4 py-2 bg-black border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Calendar size={16} /> Date Range
            </button>
            <button className="px-4 py-2 bg-black border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/80 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">PO Number</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={7} className="py-8 text-center text-zinc-500">Loading purchase history...</td></tr>
            ) : purchases.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No purchase orders found.</td></tr>
            ) : (
              purchases.filter((p: any) => (p.poNumber || p.id).includes(searchTerm) || (p.vendor?.name || p.supplier || '').toLowerCase().includes(searchTerm.toLowerCase())).map((po: any, i) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={i} className="hover:bg-zinc-800/30 transition-colors group"
              >
                <td className="px-6 py-4 font-mono text-purple-400">{po.poNumber || po.id}</td>
                <td className="px-6 py-4 text-white">{new Date(po.createdAt || po.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-white">{po.vendor?.name || po.supplier || 'Unknown'}</td>
                <td className="px-6 py-4">{po.items?.length || po.items || 0} items</td>
                <td className="px-6 py-4 font-medium text-white">{(po.totalAmount || po.amount || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${po.status === 'Delivered' || po.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : po.status === 'In Transit' || po.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {po.status === 'Delivered' || po.status === 'DELIVERED' ? <CheckCircle2 size={12}/> : <Clock size={12}/>} {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white px-3 py-1 bg-zinc-800 rounded">Reorder</button>
                    <button className="text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded"><Download size={14}/></button>
                  </div>
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
