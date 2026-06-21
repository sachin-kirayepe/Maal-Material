"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Camera, MessageSquare, Send, Bell, MapPin } from "lucide-react";

export default function FieldManagerApp() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans flex flex-col items-center justify-center">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center justify-center gap-3">
          <Smartphone className="text-purple-500" size={28} /> Field Engineer App (Mobile Preview)
        </h1>
        <p className="text-zinc-400">A responsive mobile-first view designed for site supervisors.</p>
      </div>

      {/* Mock Mobile Device Frame */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-[375px] h-[812px] bg-zinc-950 border-[8px] border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col"
      >
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-zinc-800 rounded-b-3xl w-40 mx-auto z-50"></div>

        {/* Mobile Header */}
        <div className="bg-purple-600 px-6 pt-12 pb-6 text-white rounded-b-3xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-purple-200">Current Site</p>
              <h2 className="font-semibold text-lg flex items-center gap-1"><MapPin size={16}/> Project Alpha</h2>
            </div>
            <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center active:scale-95 transition-transform">
              <Camera size={24} className="mx-auto text-purple-400 mb-2" />
              <p className="text-sm font-medium">Capture Progress</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center active:scale-95 transition-transform">
              <MessageSquare size={24} className="mx-auto text-blue-400 mb-2" />
              <p className="text-sm font-medium">Report Issue</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-zinc-300 mb-3 text-sm">Quick Updates</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Material Needed</span>
                <span className="text-xs text-zinc-500">10:30 AM</span>
              </div>
              <p className="text-sm">We need 50 bags of OPC Cement by tomorrow morning at Block C.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Milestone</span>
                <span className="text-xs text-zinc-500">Yesterday</span>
              </div>
              <p className="text-sm">Plinth level concrete pouring completed successfully.</p>
            </div>
          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex justify-between items-center px-8 pb-8">
          <div className="text-purple-500 flex flex-col items-center"><Smartphone size={20}/><span className="text-[10px] mt-1 font-medium">Home</span></div>
          <div className="text-zinc-500 flex flex-col items-center"><Camera size={20}/><span className="text-[10px] mt-1">Photos</span></div>
          <div className="text-zinc-500 flex flex-col items-center"><Send size={20}/><span className="text-[10px] mt-1">Requests</span></div>
        </div>
      </motion.div>
    </div>
  );
}
