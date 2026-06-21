"use client";

import React, { useEffect, useState } from "react";
import { Package as PackageIcon, Search as SearchIcon, Plus as PlusIcon, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
const Package = PackageIcon as any;
const Search = SearchIcon as any;
const Plus = PlusIcon as any;
const X = XIcon as any;
import { Button, Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import { useDeliveryStore } from "../../../../stores/deliveryStore";

export default function DeliveriesPage() {
  const { deliveries, fetchDeliveries, scheduleDelivery, isLoading } = useDeliveryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ orderId: "", customerId: "", shippingAddress: "" });

  const handleSubmit = async () => {
    try {
      await scheduleDelivery(formData);
      alert("Delivery scheduled successfully");
      setIsModalOpen(false);
      setFormData({ orderId: "", customerId: "", shippingAddress: "" });
      fetchDeliveries();
    } catch (e) {
      alert("Failed to schedule delivery");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Deliveries
          </h1>
          <p className="text-sm text-slate-500">
            Track and manage all outbound material shipments.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Delivery
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Delivery Queue</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search deliveries..."
              className="bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none w-48"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Delivery ID
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Order
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Address
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Loading deliveries...
                    </td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-500 flex flex-col items-center"
                    >
                      <Package className="w-8 h-8 mb-2 opacity-50" />
                      No deliveries found.
                    </td>
                  </tr>
                ) : (
                  deliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-mono text-xs font-bold">{delivery.deliveryNumber}</td>
                      <td className="p-4">{delivery.orderId}</td>
                      <td className="p-4">{delivery.customer?.name}</td>
                      <td className="p-4 text-xs truncate max-w-[200px]">
                        {delivery.shippingAddress}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2 py-1 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {delivery.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Package className="text-blue-500 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Delivery</h2>
                <p className="text-sm text-slate-500 mt-1">Create a new outbound shipment</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-500 mb-2">Order ID</label>
                  <input 
                    type="text" 
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="ORD-XXXX" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-2">Customer ID</label>
                  <input 
                    type="text" 
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    placeholder="CUST-XXXX" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-500 mb-2">Shipping Address</label>
                <textarea 
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  rows={3} placeholder="Full delivery address..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white resize-none"></textarea>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-500 transition-colors disabled:opacity-50">
                  {isLoading ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
