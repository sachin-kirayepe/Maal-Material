"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Satellite, MapPin, Gauge, Fuel, Thermometer, Radio } from "lucide-react";

import { useMonitoringStore } from "../../../stores/monitoringStore";

export default function IOTTelemetry() {
  const { nodes: machines, isLoading, fetchMonitoring } = useMonitoringStore();
  const [activeMachine, setActiveMachine] = useState<string | number | null>(1);

  React.useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Satellite className="text-emerald-500" size={28} /> IoT Telemetry & Fleet
          </h1>
          <p className="text-zinc-400">Live GPS tracking and engine diagnostics for heavy machinery across all sites.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Receiving Live Telemetry
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
        
        {/* Fleet Sidebar */}
        <div className="lg:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-2 hide-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-zinc-500 border border-zinc-800 rounded-2xl">Loading telemetry data...</div>
          ) : machines.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No machines connected.</div>
          ) : (
            machines.map((machine: any, i) => (
            <div 
              key={machine.id || i} 
              onClick={() => setActiveMachine(machine.id || i)}
              className={`bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-colors ${(machine.id || i) === activeMachine ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-white">{machine.name || machine.role || "Machine"}</h3>
                <span className={`w-2 h-2 rounded-full ${machine.status === 'Active' || machine.status === 'ACTIVE' || machine.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              </div>
              <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1"><MapPin size={12}/> {machine.location || machine.region || "Unknown Site"}</p>
              
              <div className="grid grid-cols-3 gap-2 border-t border-zinc-800 pt-3">
                <div className="text-center">
                  <Fuel size={14} className="text-zinc-500 mx-auto mb-1" />
                  <span className="text-xs font-medium">{machine.fuel || "N/A"}</span>
                </div>
                <div className="text-center">
                  <Thermometer size={14} className="text-zinc-500 mx-auto mb-1" />
                  <span className="text-xs font-medium">{machine.temp || "N/A"}</span>
                </div>
                <div className="text-center">
                  <Gauge size={14} className="text-zinc-500 mx-auto mb-1" />
                  <span className="text-xs font-medium">{machine.rpm || "N/A"}</span>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* Map & Diagnostics */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Map View */}
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden">
            {/* Fake Map Grid */}
            <div className="absolute inset-0 bg-[#0f1115]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>
              
              {/* Site Boundary Overlay */}
              <svg className="absolute inset-0 w-full h-full">
                <polygon points="30%,20% 70%,25% 65%,80% 25%,75%" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"/>
                <text x="32%" y="25%" fill="#10b981" fontSize="12" fontFamily="monospace">Project Alpha Boundary (Geofence)</text>
              </svg>

              {/* Machine Marker */}
              <motion.div 
                animate={{ x: [0, 10, -5, 0], y: [0, 5, 10, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Radio size={20} className="text-emerald-400 animate-pulse" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 border border-zinc-700 text-white text-[10px] font-medium px-3 py-1.5 rounded whitespace-nowrap backdrop-blur">
                  Volvo EC200D • 4km/h
                </div>
              </motion.div>
            </div>
          </div>

          {/* Diagnostics Panel */}
          {activeMachine === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 grid grid-cols-4 gap-6">
              <div className="col-span-1 border-r border-zinc-800 pr-6">
                <h3 className="font-medium text-white mb-1">Engine Health</h3>
                <p className="text-xs text-emerald-400 mb-4">Optimal Parameters</p>
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Service Due In</span>
                  <span className="text-white">124 Hrs</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="col-span-3 flex justify-around items-center">
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Hydraulic Temp</p>
                  <p className="text-3xl font-light text-white">65<span className="text-sm text-zinc-500">°C</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Fuel Consumption</p>
                  <p className="text-3xl font-light text-white">12.4<span className="text-sm text-zinc-500"> L/hr</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Engine Load</p>
                  <p className="text-3xl font-light text-emerald-400">76<span className="text-sm text-zinc-500">%</span></p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
