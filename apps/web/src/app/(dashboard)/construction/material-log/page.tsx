"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Plus, History, Clock, FileText, CheckCircle2, X } from "lucide-react";



import { useMaterialStore } from "@/stores/materialStore";

export default function MaterialLog() {
  const { materials, isLoading, fetchMaterials, logConsumption } = useMaterialStore();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [formData, setFormData] = useState({ material: "", qty: "", issuedTo: "", remarks: "" });

  React.useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const totalIssued = materials.reduce((acc: number, log: any) => acc + (log.quantityIssued || 0), 0);
  const estimatedValue = materials.reduce((acc: number, log: any) => acc + (log.quantityIssued || 0) * (log.unitPrice || 7000), 0);

  const handleSubmit = async () => {
    try {
      await logConsumption(formData);
      setIsLogModalOpen(false);
      setFormData({ material: "", qty: "", issuedTo: "", remarks: "" });
    } catch (error) {
      alert("Failed to log consumption");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ClipboardList className="text-purple-500" size={28} /> Daily Material Log
          </h1>
          <p className="text-zinc-400">Record daily consumption of materials issued to site contractors.</p>
        </div>
        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors"
        >
          <Plus size={18} /> Log Material Usage
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent History Table */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
              <History className="text-zinc-400" size={20} />
              <h2 className="text-xl font-medium">Recent Issue Slips</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Slip No.</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Material Issued</th>
                    <th className="px-6 py-4">Issued To</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading materials...</td></tr>
                  ) : materials.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No material logs found.</td></tr>
                  ) : (
                    materials.map((log: any, i: number) => (
                      <motion.tr 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        key={log.id} className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-zinc-300">{log.id}</td>
                        <td className="px-6 py-4 flex items-center gap-1"><Clock size={14} className="text-zinc-500"/> {new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{log.materialName || "Unknown Material"}</p>
                          <p className="text-xs text-blue-400 mt-0.5">{log.quantityIssued || 0} Units</p>
                        </td>
                        <td className="px-6 py-4">{log.issuedTo || "Subcontractor"}</td>
                        <td className="px-6 py-4">
                          <span className="flex w-fit items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs border border-green-500/20">
                            <CheckCircle2 size={12} /> {log.status || "Approved"}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Summary Widget */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FileText className="text-zinc-400" size={18} /> Today's Overview
            </h3>
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Total Materials Issued</p>
                <p className="text-2xl font-light">{isLoading ? "—" : totalIssued}</p>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Estimated Value</p>
                <p className="text-2xl font-light text-purple-400">{isLoading ? "—" : `${estimatedValue.toLocaleString()}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsLogModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-8"
            >
              <button onClick={() => setIsLogModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-light mb-6">Create Issue Slip</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Material</label>
                  <select 
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 appearance-none text-white">
                    <option value="">Select Material from BOQ...</option>
                    <option value="MAT-C-01">MAT-C-01 - OPC 43 Grade Cement</option>
                    <option value="MAT-S-01">MAT-S-01 - TMT Fe500D Rebar 12mm</option>
                    <option value="MAT-A-01">MAT-A-01 - River Sand (Washed)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Quantity Issued</label>
                    <input 
                      type="number" 
                      value={formData.qty}
                      onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                      placeholder="0" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Unit</label>
                    <input type="text" disabled placeholder="Auto-filled" className="w-full bg-black/50 border border-zinc-800 rounded-xl p-3 text-zinc-500 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Issued To (Subcontractor/Team)</label>
                  <select 
                    value={formData.issuedTo}
                    onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 appearance-none text-white">
                    <option value="">Select Contractor...</option>
                    <option value="Subcontractor A (Masonry)">Subcontractor A (Masonry)</option>
                    <option value="Subcontractor B (RCC Work)">Subcontractor B (RCC Work)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Remarks</label>
                  <textarea 
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={2} placeholder="Optional notes..." className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white resize-none"></textarea>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button onClick={() => setIsLogModalOpen(false)} className="px-6 py-2 rounded-full text-zinc-400 hover:text-white font-medium transition-colors">Cancel</button>
                  <button onClick={handleSubmit} disabled={isLoading} className="bg-purple-500 text-white px-8 py-2 rounded-full font-medium hover:bg-purple-400 transition-colors disabled:opacity-50">
                    {isLoading ? "Saving..." : "Save Issue Slip"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
