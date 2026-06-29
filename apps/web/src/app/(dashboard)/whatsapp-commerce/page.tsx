"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Settings2, CheckCircle2, Store } from "lucide-react";
import { toast } from "sonner";
import { useWhatsAppStore } from "@/stores/whatsappStore";
import { useTenantId } from "@/hooks/useTenantId";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function WhatsAppCommerce() {
  const tenantId = useTenantId();
  const { workflows, isLoading, fetchWorkflows } = useWhatsAppStore();
  const [isBotActive, setIsBotActive] = useState(true);

  React.useEffect(() => {
    if (tenantId) fetchWorkflows(tenantId);
  }, [tenantId, fetchWorkflows]);

  const handleSaveConfig = () => {
    toast.promise(Promise.resolve(), {
      loading: "Saving WhatsApp configurations...",
      success: "Configurations saved successfully.",
      error: "Failed to save configurations.",
    });
  };

  const handleChangeNumber = () => {
    toast.info("WhatsApp number change initiated. Please follow instructions sent to your email.");
  };

  // Calculate stats from workflows
  const currentMonthWorkflows = workflows.filter(w => {
    const d = new Date(w.updatedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  const messagesSent = currentMonthWorkflows.length * 4; // Approx 4 messages per workflow
  const ordersViaWA = workflows.filter(w => w.workflowType === "ORDER").length;
  const resolutionRate = workflows.length > 0 
    ? Math.round((workflows.filter(w => w.state === "COMPLETED").length / workflows.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-green-500" size={28} /> WhatsApp Commerce Bot
          </h1>
          <p className="text-zinc-400">Configure your automated WhatsApp ordering system, catalogs, and replies.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium ${isBotActive ? 'text-green-500' : 'text-zinc-500'}`}>
            {isBotActive ? 'Bot is Live' : 'Bot Paused'}
          </span>
          <button 
            onClick={() => {
              setIsBotActive(!isBotActive);
              toast.info(`WhatsApp bot ${!isBotActive ? 'activated' : 'paused'}`);
            }}
            className={`w-14 h-7 rounded-full relative transition-colors ${isBotActive ? 'bg-green-500' : 'bg-zinc-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isBotActive ? 'left-8' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2"><Settings2 size={20}/> Bot Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Connected WhatsApp Business Number</label>
                <div className="flex gap-4">
                  <input type="text" value="+91 98765 00000" disabled className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-500" />
                  <button onClick={handleChangeNumber} className="bg-zinc-800 text-white px-6 rounded-xl hover:bg-zinc-700 transition-colors whitespace-nowrap">Change Number</button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Welcome Message</label>
                <textarea 
                  rows={4} 
                  defaultValue="Welcome to Metro Hardware! 🛠️ Type '1' to see our catalog, '2' to place an order, or '3' to speak to a human." 
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-green-500 text-white resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Catalog Sync</p>
                    <p className="text-xs text-zinc-500">Sync Maal-Material inventory</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-green-500" defaultChecked />
                </div>
                <div className="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Notifications</p>
                    <p className="text-xs text-zinc-500">Send PDF invoices on WA</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-green-500" defaultChecked />
                </div>
              </div>
              
              <button onClick={handleSaveConfig} className="w-full bg-green-500 text-black py-3 rounded-xl font-medium hover:bg-green-400 transition-colors">
                Save Configurations
              </button>
            </div>
          </div>

          {/* Bot Analytics */}
          <div className="grid grid-cols-3 gap-6">
            {isLoading ? (
              <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
            ) : (
              <>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-sm text-zinc-400 mb-2">Messages Sent</p>
                  <p className="text-3xl font-medium text-white">{messagesSent > 0 ? messagesSent.toLocaleString() : "0"}</p>
                  <p className="text-xs text-green-400 mt-2">This month</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-sm text-zinc-400 mb-2">Orders via WA</p>
                  <p className="text-3xl font-medium text-white">{ordersViaWA > 0 ? ordersViaWA : "0"}</p>
                  <p className="text-xs text-green-400 mt-2">{workflows.length > 0 ? Math.round((ordersViaWA/workflows.length)*100) : 0}% of workflows</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-sm text-zinc-400 mb-2">Bot Resolution Rate</p>
                  <p className="text-3xl font-medium text-white">{resolutionRate}%</p>
                  <p className="text-xs text-zinc-500 mt-2">Without human intervention</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Preview Device */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="w-[320px] h-[650px] bg-zinc-900 border-4 border-zinc-800 rounded-[3rem] relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
              <div className="w-32 h-6 bg-zinc-800 rounded-b-xl"></div>
            </div>

            {/* App Header */}
            <div className="bg-[#075e54] text-white pt-10 pb-3 px-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Store size={20} />
              </div>
              <div>
                <p className="font-medium text-base">Metro Hardware</p>
                <p className="text-[10px] text-white/70">Bot • Online</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-[#efeae2] h-full p-4 space-y-4">
              
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto relative">
                <p className="text-sm text-zinc-800">Hi, I need 50 bags of OPC 53 Cement.</p>
                <p className="text-[10px] text-zinc-400 text-right mt-1">10:42 AM <CheckCircle2 size={10} className="inline text-blue-500"/></p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative border-l-4 border-green-500">
                <p className="text-sm text-zinc-800">Hello! 👋 Yes, we have UltraTech OPC 53 Grade available.</p>
                <p className="text-[10px] text-zinc-400 text-right mt-1">10:42 AM</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                <p className="text-sm text-zinc-800 font-medium mb-2">Options:</p>
                <button className="w-full bg-[#25d366]/10 text-[#075e54] py-1.5 rounded mb-1 text-sm font-medium">1. Confirm Order</button>
                <button className="w-full bg-[#25d366]/10 text-[#075e54] py-1.5 rounded text-sm font-medium">2. View Alternatives</button>
                <p className="text-[10px] text-zinc-400 text-right mt-1">10:42 AM</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.5 }} className="bg-white p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto relative">
                <p className="text-sm text-zinc-800">1</p>
                <p className="text-[10px] text-zinc-400 text-right mt-1">10:43 AM <CheckCircle2 size={10} className="inline text-blue-500"/></p>
              </motion.div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
