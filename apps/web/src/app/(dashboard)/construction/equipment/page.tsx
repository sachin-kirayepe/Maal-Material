"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wrench, Settings, AlertTriangle, CheckCircle2, BatteryCharging, Clock, Gauge } from "lucide-react";

import { useEquipmentStore } from "@/stores/equipmentStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function EquipmentUsage() {
  const tenantId = useTenantId();
  const { equipment: machinery, isLoading, fetchEquipment } = useEquipmentStore();

  React.useEffect(() => {
    fetchEquipment(tenantId);
  }, [fetchEquipment]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Wrench className="text-purple-500" size={28} /> Equipment Tracking
          </h1>
          <p className="text-zinc-400">Monitor heavy machinery runtime, fuel usage, and maintenance schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-sm text-zinc-400 flex items-center gap-2"><Settings size={16}/> Active Machinery</p>
          <p className="text-4xl font-light mt-4">12 <span className="text-lg text-zinc-500">/ 15</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-sm text-zinc-400 flex items-center gap-2"><BatteryCharging size={16}/> Total Fuel Consumed (Today)</p>
          <p className="text-4xl font-light mt-4 text-amber-400">240 L</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-sm text-red-400 flex items-center gap-2"><AlertTriangle size={16}/> Maintenance Due</p>
          <p className="text-4xl font-light mt-4 text-red-400">3 <span className="text-lg text-red-500/50">units</span></p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-medium">Daily Asset Log</h2>
        </div>
        
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Machinery Name</th>
              <th className="px-6 py-4 text-center">Runtime (Today)</th>
              <th className="px-6 py-4 text-center">Fuel/Power Used</th>
              <th className="px-6 py-4">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading equipment...</td></tr>
            ) : machinery.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No equipment found.</td></tr>
            ) : (
              machinery.map((item: any, i: number) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                key={item.id || i} className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-purple-400">{item.code || item.id}</td>
                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                  <Clock size={14} className="text-zinc-500"/> {item.runtime || "0 Hrs"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="flex items-center justify-center gap-1"><Gauge size={14} className="text-zinc-500"/> {item.fuel || "0 L"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${item.status === 'Active' || item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {item.status === 'Active' || item.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Settings size={12} />} {item.status}
                  </span>
                </td>
              </motion.tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
