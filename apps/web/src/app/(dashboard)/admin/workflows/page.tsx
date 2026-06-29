"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { GitMerge, Plus, Play, Save, MessageSquare, Briefcase, BellRing, Settings2, Loader2 } from "lucide-react";
import { useWorkflowsStore } from "@/stores/workflowsStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function WorkflowBuilder() {
  const tenantId = useTenantId();
  const { isLoading, fetchWorkflows } = useWorkflowsStore();

  useEffect(() => {
    fetchWorkflows(tenantId);
  }, [fetchWorkflows]);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 border-b border-zinc-800 px-8 flex items-center justify-between shrink-0 bg-zinc-950">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <GitMerge className="text-purple-500" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-medium flex items-center gap-2">
              Purchase Order Approval <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">Active</span>
            </h1>
            <p className="text-xs text-zinc-500">Last edited 2 mins ago by Super Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Play size={16} /> Test Flow
          </button>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Save size={16} /> Save Workflow
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        <div className="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-start pt-16 p-8">
          {/* Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
            
            {/* Trigger Node */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border-2 border-purple-500 rounded-2xl w-full p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  {isLoading ? <Loader2 size={14} className="text-purple-400 animate-spin" /> : <Play size={14} className="text-purple-400"/>}
                </div>
                <h3 className="font-medium">Trigger: New Purchase Order</h3>
              </div>
              <p className="text-sm text-zinc-400 pl-11">Activates when any user creates a new PO in the system.</p>
            </motion.div>

            <div className="h-12 w-px bg-zinc-700 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border border-zinc-600 rounded-full flex items-center justify-center hover:bg-zinc-700 cursor-pointer">
                <Plus size={12} className="text-zinc-400" />
              </div>
            </div>

            {/* Condition Node */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full p-5 shadow-xl relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500/20 border border-amber-500/50 rounded flex items-center justify-center text-amber-500 font-mono text-xs">IF</div>
              <div className="pl-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-amber-400">Condition Check</h3>
                  <button className="text-zinc-500 hover:text-white"><Settings2 size={16} /></button>
                </div>
                <div className="bg-black border border-zinc-800 rounded-xl p-3 text-sm flex flex-wrap gap-2 items-center">
                  <span className="text-zinc-400">Where</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded text-white">PO.TotalAmount</span>
                  <span className="text-zinc-400">is greater than</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded text-white font-mono">1,00,000</span>
                </div>
              </div>
            </motion.div>

            <div className="flex w-full mt-4 mb-4">
              <div className="w-1/2 flex flex-col items-center border-t border-r border-zinc-700 rounded-tr-xl mt-6 relative h-12">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 px-2 text-xs text-green-400 font-medium">True</span>
              </div>
              <div className="w-1/2 flex flex-col items-center border-t border-l border-zinc-700 rounded-tl-xl mt-6 relative h-12">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 px-2 text-xs text-red-400 font-medium">False</span>
              </div>
            </div>

            <div className="flex w-full gap-8">
              {/* True Branch */}
              <div className="w-1/2 flex flex-col items-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full p-4 shadow-xl text-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3"><Briefcase size={16} className="text-blue-400"/></div>
                  <h3 className="font-medium text-sm mb-1">Require CEO Approval</h3>
                  <p className="text-xs text-zinc-500">Route to Executive Dashboard</p>
                </motion.div>
                <div className="h-8 w-px bg-zinc-700"></div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full p-4 shadow-xl text-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3"><MessageSquare size={16} className="text-green-400"/></div>
                  <h3 className="font-medium text-sm mb-1">Send WhatsApp Alert</h3>
                  <p className="text-xs text-zinc-500">To: Configured Number</p>
                </motion.div>
              </div>

              {/* False Branch */}
              <div className="w-1/2 flex flex-col items-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full p-4 shadow-xl text-center">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3"><BellRing size={16} className="text-purple-400"/></div>
                  <h3 className="font-medium text-sm mb-1">Auto-Approve</h3>
                  <p className="text-xs text-zinc-500">Update status to 'Approved'</p>
                </motion.div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Action Sidebar */}
        <aside className="w-80 border-l border-zinc-800 bg-zinc-950 p-6 flex flex-col">
          <h2 className="font-medium mb-6">Add Node</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Logic</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-colors text-sm">
                  <GitMerge size={18} className="text-amber-400" /> Condition
                </button>
                <button className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-colors text-sm">
                  <div className="text-blue-400" /> Delay
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Actions</p>
              <div className="space-y-2">
                {[
                  { icon: <MessageSquare size={16} className="text-green-400"/>, label: "Send WhatsApp" },
                  { icon: <Briefcase size={16} className="text-blue-400"/>, label: "Request Approval" },
                  { icon: <Settings2 size={16} className="text-purple-400"/>, label: "Update Database" }
                ].map((action, i) => (
                  <button key={i} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 hover:bg-zinc-800 transition-colors text-sm text-left">
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
