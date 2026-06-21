"use client";

import React from "react";
import { motion } from "framer-motion";
import { Share2, Warehouse, ArrowRightLeft, ArrowRight, ShieldAlert, Check } from "lucide-react";

import { useInventorySharingStore } from "../../../stores/inventorySharingStore";

export default function InventorySharing() {
  const { transfers: sharingRequests, isLoading, fetchTransfers } = useInventorySharingStore();

  React.useEffect(() => {
    fetchTransfers("tenant-1");
  }, [fetchTransfers]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Share2 className="text-blue-500" size={28} /> Multi-Warehouse Stock Sharing
          </h1>
          <p className="text-zinc-400">Request and transfer inventory laterally between different sites and warehouses to resolve shortages.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-400 transition-colors">
          <ArrowRightLeft size={18} /> Request Transfer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30">
              <h2 className="text-xl font-medium">Active Transfer Requests</h2>
            </div>
            
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Request</th>
                  <th className="px-6 py-4">Material Route</th>
                  <th className="px-6 py-4">Urgency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading transfers...</td></tr>
                ) : sharingRequests.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No transfer requests found.</td></tr>
                ) : (
                  sharingRequests.map((req: any, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    key={req.id || i} className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white mb-1">{req.item || req.itemId || "Item"}</p>
                      <p className="text-xs text-blue-400 font-mono">{req.id?.slice(0,8) || `REQ-${i}`} • {req.qty || req.quantity || 1} Units</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="truncate max-w-[100px]" title={req.from || req.sourceEntityId}>{req.from || req.sourceEntityId}</span>
                        <ArrowRight size={12} className="text-zinc-500 shrink-0" />
                        <span className="text-white truncate max-w-[100px]" title={req.to || req.targetEntityId}>{req.to || req.targetEntityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${req.urgency === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {req.urgency || "Medium"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded border ${req.status === 'Approved' || req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                        {req.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending Approval' || req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button className="text-green-500 hover:text-green-400 transition-colors bg-green-500/10 p-1.5 rounded"><Check size={16}/></button>
                          <button className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 p-1.5 rounded uppercase text-[10px] px-2 font-medium">Reject</button>
                        </div>
                      ) : (
                        <button className="text-blue-400 text-xs hover:underline">Track</button>
                      )}
                    </td>
                  </motion.tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Stock Search */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Warehouse size={18} className="text-blue-400"/> Find Material Across Sites</h3>
            
            <div className="relative mb-6">
              <input type="text" placeholder="e.g., Cement OPC 53" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white" />
            </div>

            <div className="space-y-3">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium text-white text-sm">Bhiwandi Central Hub</p>
                  <p className="text-xs text-green-400 mt-1">Available: 4,500 Bags</p>
                </div>
                <button className="text-xs bg-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-700">Request</button>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium text-white text-sm">Project Beta (Andheri)</p>
                  <p className="text-xs text-amber-400 mt-1">Available: 150 Bags</p>
                </div>
                <button className="text-xs bg-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-700">Request</button>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex gap-3 items-start">
            <ShieldAlert size={20} className="text-red-400 shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-1">Critical Shortage</h4>
              <p className="text-xs text-red-400/70">Project Alpha is running out of TMT Steel (ETA to empty: 2 Days). Request a lateral transfer from Project Gamma immediately.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
