"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, UploadCloud, Search, Filter, AlertCircle, FilePlus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useBOQStore } from "@/stores/boqStore";
import { useUploadStore } from "@/stores/uploadStore";

export default function BOQManager() {
  const { items, meta, isLoading, fetchItems } = useBOQStore();
  const uploadState = useUploadStore();
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadState.uploadFile('constructos-boq', e.target.files[0], 'boq');
      if (url) {
        // Here we would typically trigger processing the BOQ on the backend
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    fetchItems("", currentPage, 10); // "" as projectId means all projects for now
  }, [fetchItems, currentPage]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <FileSpreadsheet className="text-purple-500" size={28} /> Bill of Quantities (BOQ)
          </h1>
          <p className="text-zinc-400">Manage project estimates, track procured quantities against the baseline BOQ.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors">
            <FilePlus size={16} /> Add Item Manually
          </button>
          <button 
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            <UploadCloud size={18} /> Upload BOQ (Excel)
          </button>
        </div>
      </div>

      {/* Upload Zone (Conditional) */}
      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center relative"
        >
          <UploadCloud size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Drag and drop your BOQ file</h3>
          <p className="text-zinc-500 mb-6">Supports .xlsx, .xls, and .csv formats. Download our standard template <a href="#" className="text-purple-400 hover:underline">here</a>.</p>
          <label className="bg-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-400 transition-colors cursor-pointer inline-block">
            {uploadState.isUploading ? 'Uploading...' : 'Browse Files'}
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
              disabled={uploadState.isUploading}
              onChange={handleFileUpload}
            />
          </label>
          {uploadState.error && <p className="text-red-500 mt-4 text-sm">{uploadState.error}</p>}
          {uploadState.uploadedUrl && <p className="text-green-500 mt-4 text-sm">Upload successful!</p>}
        </motion.div>
      )}

      {/* BOQ Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium">Master BOQ List</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search by code or description..." 
                className="bg-black border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white w-64"
              />
            </div>
            <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
              <Filter size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Item Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4 text-right">Est. Qty</th>
                <th className="px-6 py-4 text-right">Procured</th>
                <th className="px-6 py-4 text-right">Consumed</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={24} />
                    Loading BOQ items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    No BOQ items found.
                  </td>
                </tr>
              ) : items.map((item: any, i: number) => {
                const consumptionPercent = item.estimatedQty ? (item.consumedQty / item.estimatedQty) * 100 : 0;
                return (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    key={item.id} className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-zinc-300">{item.itemCode || "N/A"}</td>
                    <td className="px-6 py-4 font-medium text-white">{item.description}</td>
                    <td className="px-6 py-4">{item.unit}</td>
                    <td className="px-6 py-4 text-right">{item.estimatedQty?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-right text-blue-400">{item.procuredQty?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white">{item.consumedQty?.toLocaleString() || 0}</span>
                        <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full ${consumptionPercent > 90 ? 'bg-red-500' : consumptionPercent > 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${consumptionPercent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {consumptionPercent > 90 ? (
                        <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-400/20 w-max">
                          <AlertCircle size={12} /> Critical Limit
                        </span>
                      ) : consumptionPercent > 70 ? (
                        <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-400/20 w-max">
                          <AlertCircle size={12} /> Warning
                        </span>
                      ) : (
                        <span className="text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-green-500/20 w-max">
                          On Track
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <span className="text-sm text-zinc-500">
            {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={isLoading || currentPage === 1}
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
    </div>
  );
}
