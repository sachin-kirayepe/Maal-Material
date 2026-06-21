"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileSearch, CheckCircle2, AlertTriangle, UploadCloud, Link as LinkIcon, Loader2 } from "lucide-react";
import { useUploadStore } from "@/stores/uploadStore";

export default function BankReconciliation() {
  const uploadState = useUploadStore();

  const handleStatementUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadState.uploadFile('constructos-finance', e.target.files[0], 'statements');
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <FileSearch className="text-purple-500" size={28} /> Bank Reconciliation
          </h1>
          <p className="text-zinc-400">Match internal Maal-Material ledger entries against uploaded bank statements.</p>
        </div>
        <label className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${uploadState.isUploading ? 'bg-purple-400 text-white' : uploadState.uploadedUrl ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-purple-500 text-white hover:bg-purple-400'}`}>
          {uploadState.isUploading ? <Loader2 size={18} className="animate-spin" /> : uploadState.uploadedUrl ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
          {uploadState.isUploading ? 'Uploading...' : uploadState.uploadedUrl ? 'Statement Uploaded' : 'Upload Statement'}
          <input type="file" accept=".pdf,.csv,.xlsx" className="hidden" disabled={uploadState.isUploading} onChange={handleStatementUpload} />
        </label>
      </div>

      {/* Auto-Match Status */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400"><CheckCircle2 size={24} /></div>
          <div>
            <h3 className="text-green-400 font-medium text-lg">Auto-Match Complete</h3>
            <p className="text-green-500/70 text-sm">AI successfully matched 142 out of 145 transactions.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-light text-white">3</p>
          <p className="text-sm text-zinc-400">Unmatched Entries</p>
        </div>
      </div>

      <h2 className="text-xl font-medium mb-4">Pending Manual Review</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((_, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-amber-500/5 border-b border-zinc-800 flex items-center gap-2 text-amber-400 text-sm font-medium">
              <AlertTriangle size={16} /> Needs Attention
            </div>
            
            <div className="p-6 flex-1 flex gap-6">
              {/* Bank Statement Entry */}
              <div className="flex-1">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Bank Statement</p>
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-sm text-zinc-400 mb-1">15 Jun, 2026</p>
                  <p className="font-mono text-sm text-white mb-3">NEFT-IN-HDFC-9921</p>
                  <p className="text-xl text-green-400">+ ₹45,000</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pt-6">
                <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center"><LinkIcon size={14} className="text-zinc-500"/></div>
              </div>

              {/* Suggested Ledger Match */}
              <div className="flex-1">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Suggested Ledger Entry</p>
                <div className="bg-purple-500/5 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-sm text-zinc-400 mb-1">14 Jun, 2026 (1 Day Off)</p>
                  <p className="text-sm text-white mb-3">Client Advance - Project Alpha</p>
                  <p className="text-xl text-green-400">+ ₹45,000</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-black/30 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Find Other</button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">Confirm Match</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
