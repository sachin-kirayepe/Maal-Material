"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PackageSearch, PackageCheck, Package, Check, ClipboardList, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useWarehouseStore } from "@/stores/warehouseStore";

export default function WarehouseFulfillment() {
  const { dispatches, meta, isLoading, fetchDispatches, markDispatchPacked } = useWarehouseStore();
  const [activeTab, setActiveTab] = useState("Pending Packing");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDispatches(currentPage, 12);
  }, [fetchDispatches, currentPage]);

  const handlePack = async (id: string) => {
    await markDispatchPacked(id);
    fetchDispatches(currentPage, 12);
  };

  const visibleOrders = dispatches.filter((o: any) => 
    activeTab === "Pending Packing" ? o.status === "APPROVED" || o.status === "PICKING" : o.status === "PACKED" || o.status === "DISPATCHED"
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <PackageSearch className="text-purple-500" size={28} /> Warehouse Fulfillment
          </h1>
          <p className="text-zinc-400">Manage daily dispatch orders, pack items, and generate waybills.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors">
          <ClipboardList size={16} /> Print Pick List
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-2">
        {["Pending Packing", "Ready for Dispatch"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            {tab} {tab === "Pending Packing" && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleOrders.map((order: any, i: number) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            key={order.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-mono text-zinc-400">{order.dispatchNumber}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border ${
                order.status === 'APPROVED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                order.status === 'PICKING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex-1 mb-6">
              <p className="text-xs text-zinc-500 mb-2">Items to Pack:</p>
              <ul className="space-y-2 mb-4">
                {order.dispatchItems?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Package size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                    {item.productName} ({item.quantity})
                  </li>
                ))}
              </ul>
              
              <div className="bg-black border border-zinc-800 p-3 rounded-lg flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={16} className="text-purple-400" /> Deliver to: <span className="text-white">Delivery {order.deliveries?.deliveryNumber}</span>
              </div>
            </div>

            {activeTab === "Pending Packing" ? (
              <button 
                onClick={() => handlePack(order.id)}
                className="w-full py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-400 transition-colors flex items-center justify-center gap-2"
              >
                <PackageCheck size={18} /> Mark as Packed
              </button>
            ) : (
              <button className="w-full py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                <Check size={18} className="text-green-400" /> Assign to Truck
              </button>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="col-span-full py-12 flex justify-center text-zinc-500">
            <Loader2 className="animate-spin text-purple-500 mr-2" size={24} /> Loading dispatches...
          </div>
        )}
        {!isLoading && visibleOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No orders found in this status.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="p-4 flex justify-between items-center mt-6">
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
  );
}
