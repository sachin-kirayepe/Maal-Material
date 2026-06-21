"use client";

import React, { useState, useEffect } from "react";
import { Truck, MapPin, Clock, CheckCircle2, Navigation, AlertTriangle, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDeliveryStore } from "@/stores/deliveryStore";

export default function DeliveryTracking() {
  const { deliveries, meta, isLoading, fetchDeliveries } = useDeliveryStore();
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDeliveries(currentPage, 10);
  }, [fetchDeliveries, currentPage]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Navigation className="text-purple-500" size={28} /> Live Fleet Tracking
          </h1>
          <p className="text-zinc-400">Monitor in-transit deliveries, ETAs, and driver status in real-time.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search Waybill / TRK ID..." 
            className="bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 text-white w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Delivery List */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="space-y-4 flex-1">
            {isLoading ? (
              <div className="py-12 flex justify-center text-zinc-500">
                <Loader2 className="animate-spin text-purple-500 mr-2" size={24} /> Loading...
              </div>
            ) : deliveries.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                No active deliveries.
              </div>
            ) : deliveries.map((delivery: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                key={delivery.id}
                onClick={() => setSelectedDelivery(delivery)}
                className={`bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-colors ${selectedDelivery?.id === delivery.id ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-mono text-zinc-400">{delivery.deliveryNumber}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${
                    delivery.deliveryStatus === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    delivery.deliveryStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    ['FAILED', 'DELAYED'].includes(delivery.deliveryStatus) ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {delivery.deliveryStatus === 'IN_TRANSIT' && <Truck size={12} />}
                    {delivery.deliveryStatus === 'DELIVERED' && <CheckCircle2 size={12} />}
                    {['FAILED', 'DELAYED'].includes(delivery.deliveryStatus) && <AlertTriangle size={12} />}
                    {delivery.deliveryStatus}
                  </span>
                </div>
                <h3 className="font-medium text-white mb-1 leading-tight">Order {delivery.order?.orderNumber}</h3>
                <p className="text-sm text-zinc-500 flex items-center gap-1"><Clock size={14} /> Created: {new Date(delivery.createdAt).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-zinc-800 flex justify-between items-center mt-4">
            <span className="text-sm text-zinc-500">
              {meta ? `Page ${meta.page} of ${meta.totalPages || 1}` : "..."}
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
                disabled={!!isLoading || !!(meta && currentPage >= (meta.totalPages || 1))}
                className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Details / Map Panel */}
        <div className="lg:col-span-2">
          {selectedDelivery ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden h-full flex flex-col"
            >
              <div className="h-64 relative bg-zinc-800 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent"></div>
                <div className="text-center z-10">
                  <MapPin size={48} className="text-zinc-500 mx-auto mb-2 opacity-50" />
                  <p className="text-zinc-500">Live Map Integration (Google Maps API)</p>
                </div>
                
                {/* Mock Map Route */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
                  <path d="M 100 200 C 300 200, 400 50, 700 150" fill="transparent" stroke="#a855f7" strokeWidth="3" strokeDasharray="5,5" />
                  <circle cx="100" cy="200" r="6" fill="#a855f7" />
                  <circle cx="700" cy="150" r="6" fill="#ef4444" />
                </svg>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-light text-white mb-1">{selectedDelivery.deliveryNumber}</h2>
                      <p className="text-zinc-400">Order: {selectedDelivery.order?.orderNumber}</p>
                    </div>
                    {selectedDelivery.failureReason && (
                      <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full text-sm font-medium border border-red-400/20">
                        <AlertTriangle size={16} /> {selectedDelivery.failureReason}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Origin Warehouse</p>
                      <p className="font-medium text-white flex items-center gap-2"><MapPin size={16} className="text-zinc-400" /> {selectedDelivery.warehouseId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Destination</p>
                      <p className="font-medium text-white flex items-center gap-2"><MapPin size={16} className="text-purple-400" /> {selectedDelivery.shippingAddress}, {selectedDelivery.shippingCity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Driver Details</p>
                      <p className="font-medium text-white">{selectedDelivery.drivers?.name || "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Vehicle No.</p>
                      <p className="font-medium text-white">{selectedDelivery.vehicles?.vehicleNumber || "Unassigned"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 border-t border-zinc-800 pt-6">
                  <button className="px-6 py-2 rounded-full text-zinc-400 hover:text-white font-medium transition-colors">Call Driver</button>
                  <button className="bg-white text-black px-8 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
                    View Waybill
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-full flex items-center justify-center p-12 text-center">
              <div>
                <Navigation size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-xl font-medium text-zinc-400 mb-2">Select a delivery</h3>
                <p className="text-zinc-600">Click on a tracking ID from the list to view its live status and route.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
