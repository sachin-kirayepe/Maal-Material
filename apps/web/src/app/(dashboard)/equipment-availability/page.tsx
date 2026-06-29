"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Truck } from "lucide-react";

import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

const days = Array.from({ length: 14 }, (_, i) => i + 10);

export default function MachineAvailability() {
  const [equipment, setEquipment] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await apiClient.get('/api/v1/equipment-availability?tenantId=default&equipmentId=all');
        const data = res.data?.data || [];
        setEquipment(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch equipment availability", e);
      }
    };
    fetchEquipment();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <CalendarDays className="text-purple-500" size={28} /> Availability Calendar
          </h1>
          <p className="text-zinc-400">View current bookings and plan future machinery deployments.</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
          <button className="text-zinc-400 hover:text-white"><ChevronLeft size={18}/></button>
          <span className="font-medium text-sm w-32 text-center">June 2026</span>
          <button className="text-zinc-400 hover:text-white"><ChevronRight size={18}/></button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400 min-w-[1000px]">
          <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4 w-64 border-r border-zinc-800 sticky left-0 bg-black/90 backdrop-blur z-10">Machinery</th>
              {days.map((d) => (
                <th key={d} className="px-2 py-4 text-center w-12 border-r border-zinc-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-600 mb-1">Jun</span>
                    <span className={`text-sm ${d === 15 ? 'text-purple-400 font-bold' : 'text-zinc-400'}`}>{d}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {equipment.length > 0 ? equipment.map((item, idx) => (
              <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 border-r border-zinc-800 sticky left-0 bg-zinc-900 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center"><Truck size={14}/></div>
                    <div>
                      <p className="font-medium text-white">{item.name || "Equipment"}</p>
                      <p className="text-xs text-zinc-500">{item.category || "General"}</p>
                    </div>
                  </div>
                </td>
                {days.map((d) => {
                  const isBooked = false; // Add real logic here
                  return (
                    <td key={d} className="p-0 border-r border-zinc-800/50 relative h-16">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-purple-500 text-white flex items-center justify-center text-lg font-light pb-1">+</button>
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            )) : (
              <tr><td colSpan={15} className="text-center py-8 text-zinc-500">No equipment availability data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
