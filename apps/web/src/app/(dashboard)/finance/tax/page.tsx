"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Percent, Plus, Settings, X, Edit2, Trash2, Loader2 } from "lucide-react";
import { useTaxStore } from "@/stores/taxStore";

export default function TaxConfiguration() {
  const { rules, loading, fetchTaxData } = useTaxStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTaxData();
  }, [fetchTaxData]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Percent className="text-purple-500" size={28} /> Tax & GST Configuration
          </h1>
          <p className="text-zinc-400">Manage tax rates applicable to different materials and services across Maal-Material.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={18} /> Add New Tax Rule
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium">Active Tax Rules</h2>
          <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
            <Settings size={16} className="text-zinc-400" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Rule Name</th>
                <th className="px-6 py-4">Tax Type</th>
                <th className="px-6 py-4">Applied Categories</th>
                <th className="px-6 py-4">Rate (%)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                    Loading rules...
                  </td>
                </tr>
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No tax rules configured.
                  </td>
                </tr>
              ) : rules.map((rule: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  key={rule.id} className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{rule.name}</td>
                  <td className="px-6 py-4">{rule.taxType || "GST"}</td>
                  <td className="px-6 py-4">All Categories</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 text-white px-2 py-1 rounded text-xs border border-zinc-700">
                      {rule.taxRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${rule.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-zinc-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                      <button className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tax Rule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-8"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-light mb-6">Create Tax Rule</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Rule Name</label>
                  <input type="text" placeholder="e.g. GST - Paints" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-zinc-600 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Tax Type</label>
                    <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-zinc-600 appearance-none text-white">
                      <option>GST (CGST + SGST)</option>
                      <option>IGST</option>
                      <option>TDS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Tax Rate (%)</label>
                    <input type="number" placeholder="18" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-zinc-600 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Apply to Categories</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-zinc-600 appearance-none text-white">
                    <option>Select Categories...</option>
                    <option>Cement</option>
                    <option>Steel</option>
                    <option>Paints</option>
                    <option>Aggregates</option>
                  </select>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full text-zinc-400 hover:text-white font-medium transition-colors">Cancel</button>
                  <button onClick={() => setIsModalOpen(false)} className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">Save Tax Rule</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
