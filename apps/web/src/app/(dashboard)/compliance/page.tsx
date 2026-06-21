"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ShieldAlert, CheckCircle2, FileWarning, CheckSquare, Square, Loader2 } from "lucide-react";
import { useUploadStore } from "../../../stores/uploadStore";

import { useComplianceStore } from "../../../stores/complianceStore";

export default function ComplianceChecklists() {
  const { records: complianceItems, isLoading, fetchRecords } = useComplianceStore();

  React.useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);
  const [activeChecklist, setActiveChecklist] = useState<number | null>(2);
  const uploadState = useUploadStore();

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadState.uploadFile('constructos-compliance', e.target.files[0], 'licenses');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ClipboardList className="text-purple-500" size={28} /> Safety & Legal Compliance
          </h1>
          <p className="text-zinc-400">Track site safety regulations, legal certificates, and ISO compliance statuses.</p>
        </div>
        <button className="bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
          Create New Checklist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compliance Dashboard / List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Overall Compliance Score</p>
              <p className="text-2xl font-medium text-green-400">92%</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs text-red-400 mb-1">Critical Overdue</p>
              <p className="text-2xl font-medium text-red-500">2 Items</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Upcoming Audits</p>
              <p className="text-2xl font-medium text-white">5</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
              <h2 className="text-xl font-medium">Active Checklists</h2>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 bg-black border border-zinc-700 rounded text-zinc-300">Filter by Site</button>
              </div>
            </div>
            
            <div className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <div className="p-6 text-center text-zinc-500">Loading compliance records...</div>
              ) : complianceItems.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800">No compliance records found.</div>
              ) : (
                complianceItems.map((item: any, i) => (
                <div 
                  key={item.id || i} 
                  onClick={() => setActiveChecklist(item.id || i)}
                  className={`p-6 cursor-pointer transition-colors flex justify-between items-center ${activeChecklist === (item.id || i) ? 'bg-purple-500/5 border-l-2 border-purple-500' : 'hover:bg-zinc-800/30 border-l-2 border-transparent'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {(item.status === 'Completed' || item.status === 'COMPLETED') && <CheckCircle2 className="text-green-500" size={20}/>}
                      {(item.status === 'Pending Action' || item.status === 'PENDING') && <FileWarning className="text-amber-500" size={20}/>}
                      {(item.status === 'Overdue' || item.status === 'OVERDUE') && <ShieldAlert className="text-red-500" size={20}/>}
                      {!item.status && <CheckCircle2 className="text-green-500" size={20} />}
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{item.title || item.reportType || "Compliance Audit"}</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{item.category || "General"}</span>
                        <span className="text-zinc-500">{item.frequency || "Monthly"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${(item.status === 'Completed' || item.status === 'COMPLETED') ? 'text-green-400' : (item.status === 'Overdue' || item.status === 'OVERDUE') ? 'text-red-400' : 'text-amber-400'}`}>{item.status || "COMPLETED"}</p>
                    <p className="text-xs text-zinc-500 mt-1">Score: {item.score || "100%"}</p>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>

        {/* Active Checklist Details */}
        <div className="lg:col-span-1">
          {activeChecklist === 2 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-medium mb-2">Heavy Machinery Operator Licenses</h3>
              <p className="text-sm text-zinc-400 mb-6">Verify that all active Crane and JCB operators at Project Alpha have valid state licenses.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckSquare size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Ramesh Kumar (Crane Op)</p>
                    <p className="text-xs text-zinc-500">License Valid till 2028</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Square size={18} className="text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Suresh Das (JCB Op)</p>
                    <p className="text-xs text-red-400">License Expired! (Action Required)</p>
                    <label className="inline-block text-[10px] mt-1 bg-zinc-800 px-2 py-1 rounded text-zinc-300 cursor-pointer hover:bg-zinc-700">
                      {uploadState.isUploading ? <Loader2 size={10} className="inline animate-spin mr-1" /> : null}
                      {uploadState.isUploading ? 'Uploading...' : uploadState.uploadedUrl ? 'Uploaded' : 'Upload New License'}
                      <input type="file" accept=".pdf,.jpg,.png" className="hidden" disabled={uploadState.isUploading} onChange={handleLicenseUpload} />
                    </label>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Amit Singh (Excavator Op)</p>
                    <p className="text-xs text-zinc-500">License Valid till 2027</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <button className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-500 hover:text-white transition-colors">
                  Notify Compliance Officer
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex items-center justify-center text-zinc-500 text-sm">
              Select a checklist to view details
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
