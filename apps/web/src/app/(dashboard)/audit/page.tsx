"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Filter, Download, User, Database, IndianRupee, ShieldAlert, ArrowUpRight, Search } from "lucide-react";

import { useAuditStore } from "../../../stores/auditStore";

export default function AuditLogs() {
  const { logs: auditLogs, isLoading, fetchLogs } = useAuditStore();

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'finance': return <IndianRupee size={14} className="text-emerald-400" />;
      case 'system': return <Database size={14} className="text-blue-400" />;
      case 'security': return <ShieldAlert size={14} className="text-red-400" />;
      default: return <FileSearch size={14} className="text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <FileSearch className="text-purple-500" size={28} /> System & Financial Audit Logs
          </h1>
          <p className="text-zinc-400">Immutable ledger of all critical actions, financial transactions, and security events.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors">
          <Download size={18} /> Export Compliance Report
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
          <div className="flex gap-4 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search by action, user, or target..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white" 
              />
            </div>
            <select className="bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-purple-500">
              <option>All Event Types</option>
              <option>Financial</option>
              <option>Security</option>
              <option>System Actions</option>
            </select>
            <button className="px-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
        
        {/* Log Table */}
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/80 text-zinc-500 text-xs uppercase font-medium tracking-wider">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">User / Source</th>
              <th className="px-6 py-4">Action Details</th>
              <th className="px-6 py-4">Target Entity</th>
              <th className="px-6 py-4 text-right">IP Trace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={6} className="py-8 text-center text-zinc-500">Loading audit logs...</td></tr>
            ) : auditLogs.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No audit logs found.</td></tr>
            ) : (
              auditLogs.filter((log: any) => (log.action || "").toLowerCase().includes(searchTerm.toLowerCase()) || (log.user || log.userId || "").toLowerCase().includes(searchTerm.toLowerCase())).map((log: any, i) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                key={log.id || i} className="hover:bg-zinc-800/30 transition-colors font-mono text-xs"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-white">{log.date || (log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "-")}</span>
                  <span className="text-zinc-500 ml-2">{log.time || (log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "")}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-black border border-zinc-800 w-fit px-2 py-1 rounded">
                    {getTypeIcon(log.type || log.entityType || "system")}
                    <span className="uppercase text-[10px] tracking-widest">{log.type || log.entityType || "system"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-zinc-500"/>
                    <span className="text-zinc-300">{log.user || log.userId || "System"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-sans text-sm">
                  {log.action}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">{log.target || log.entityId || "N/A"}</span>
                </td>
                <td className="px-6 py-4 text-right text-zinc-600">
                  {log.ip || "Internal"}
                  <button className="ml-2 hover:text-white transition-colors"><ArrowUpRight size={14} className="inline"/></button>
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-800 bg-black/50 text-xs text-zinc-500 flex justify-between items-center">
          <p>Showing 4 of 124,592 records</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-zinc-800 rounded hover:text-white">Prev</button>
            <button className="px-3 py-1 bg-zinc-800 rounded hover:text-white">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
