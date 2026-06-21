"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Navigation, Phone, CheckCircle2, Clock } from "lucide-react";

export default function DeliveryTracking() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Navigation className="text-blue-500" size={28} /> Live Delivery Tracking
          </h1>
          <p className="text-zinc-400">Track driver locations, ETAs, and e-way bill statuses for last-mile deliveries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Deliveries List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 cursor-pointer border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded uppercase font-medium tracking-wider flex items-center gap-1">
                <Truck size={12}/> In Transit
              </span>
              <span className="text-xs text-zinc-500 font-mono">ID: DL-8812</span>
            </div>
            <h3 className="font-medium text-white mb-1">TMT Steel (12 MT)</h3>
            <p className="text-xs text-zinc-400 mb-3">To: Project Alpha (Bandra Kurla Complex)</p>
            <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-3">
              <span className="text-zinc-500">ETA</span>
              <span className="text-blue-400 font-medium">45 Mins</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 cursor-pointer hover:border-zinc-700 transition-colors opacity-70">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded uppercase font-medium tracking-wider flex items-center gap-1">
                <Clock size={12}/> Loading
              </span>
              <span className="text-xs text-zinc-500 font-mono">ID: DL-8815</span>
            </div>
            <h3 className="font-medium text-white mb-1">Paints & Primers</h3>
            <p className="text-xs text-zinc-400 mb-3">To: Project Beta (Andheri East)</p>
            <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-3">
              <span className="text-zinc-500">Departing in</span>
              <span className="text-amber-400 font-medium">10 Mins</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 cursor-pointer hover:border-zinc-700 transition-colors opacity-50">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-green-500/10 text-green-500 text-xs px-2 py-0.5 rounded uppercase font-medium tracking-wider flex items-center gap-1">
                <CheckCircle2 size={12}/> Delivered
              </span>
              <span className="text-xs text-zinc-500 font-mono">ID: DL-8809</span>
            </div>
            <h3 className="font-medium text-white mb-1">Vitrified Tiles</h3>
            <p className="text-xs text-zinc-400 mb-3">To: Project Gamma (Powai)</p>
            <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-3">
              <span className="text-zinc-500">Delivered At</span>
              <span className="text-green-500 font-medium">09:15 AM</span>
            </div>
          </div>

        </div>

        {/* Live Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fake Map Container */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative h-[400px]">
            {/* Map Imagery Simulation */}
            <div className="absolute inset-0 bg-[#0f1115]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>
              
              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path d="M 20% 80% L 40% 60% L 60% 65% L 80% 30%" fill="none" stroke="#3b82f6" strokeWidth="4" className="opacity-50" />
                <path d="M 20% 80% L 40% 60% L 60% 65% L 80% 30%" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" className="opacity-100 animate-pulse" />
              </svg>

              {/* Start Point */}
              <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 translate-y-1/2">
                <div className="w-4 h-4 bg-zinc-800 border-2 border-zinc-500 rounded-full"></div>
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-black/80 px-2 py-1 rounded">Bhiwandi Hub</span>
              </div>

              {/* End Point */}
              <div className="absolute top-[30%] right-[20%] translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded whitespace-nowrap">Project Alpha</span>
              </div>

              {/* Live Truck Marker */}
              <motion.div 
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-[62%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-white/20">
                  <Truck size={18} />
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap">
                  35 km/h
                </div>
              </motion.div>
            </div>
            
            {/* Live Status Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 border border-zinc-800 backdrop-blur-md p-3 rounded-xl flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <span className="text-xs font-medium text-white tracking-widest uppercase">GPS Active</span>
            </div>
          </div>

          {/* Driver & Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                  <span className="font-medium text-lg">RJ</span>
                </div>
                <div>
                  <p className="font-medium text-white">Ramesh Jadhav</p>
                  <p className="text-xs text-zinc-400">Vehicle: MH-04-AB-1234 (Tata 407)</p>
                </div>
              </div>
              <button className="w-10 h-10 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                <Phone size={18} />
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">E-Way Bill Status</p>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Valid</span>
              </div>
              <p className="text-xs text-zinc-400 mb-1">EWB No: 123456789012</p>
              <p className="text-xs text-zinc-400">Expires: 11 Jun 2026, 11:59 PM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
