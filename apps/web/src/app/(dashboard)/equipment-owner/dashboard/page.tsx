"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useEquipmentStore } from "@/stores/equipmentStore";
import { 
  Tractor, 
  CalendarDays, 
  IndianRupee, 
  Star,
  Activity,
  Plus,
  ArrowUpRight,
  Clock,
  Scan
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@constructos/ui";

export default function EquipmentOwnerDashboard() {
  const { user } = useAuthStore();
  const { equipment, fetchEquipment, isLoading } = useEquipmentStore();

  useEffect(() => {
    if (user?.tenantId) {
      fetchEquipment(user.tenantId);
    }
  }, [user]);

  const activeRentals = equipment.filter(e => e.status === "RENTED").length;
  const availableMachines = equipment.filter(e => e.status === "AVAILABLE").length;
  
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Tractor className="w-8 h-8 text-amber-500" />
            Fleet Command Center
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your heavy machinery, track bookings, and monitor utilization.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/equipment-owner/gate-pass">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-500" /> Gate Pass
            </Button>
          </Link>
          <Link href="/equipment-owner/machines/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Plus className="w-4 h-4" /> Add Machine
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-emerald-400 text-xs font-semibold flex items-center bg-emerald-500/10 px-2 py-1 rounded-full">
              +12% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-zinc-400 text-sm font-medium">Active Rentals</h3>
            <p className="text-3xl font-bold text-white mt-1">{activeRentals}</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-zinc-400 text-sm font-medium">Available Machines</h3>
            <p className="text-3xl font-bold text-white mt-1">{availableMachines}</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-zinc-400 text-sm font-medium">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-white mt-1">N/A</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-zinc-400 text-sm font-medium">Average Rating</h3>
            <p className="text-3xl font-bold text-white mt-1">4.8 <span className="text-lg text-zinc-500 font-normal">/ 5</span></p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold text-white">Your Fleet</h2>
            <Link href="/equipment-owner/machines" className="text-amber-500 text-sm hover:underline">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="h-48 flex items-center justify-center border border-zinc-800/50 rounded-xl bg-zinc-900/20">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : equipment.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              <Tractor className="w-10 h-10 text-zinc-600 mb-3" />
              <p className="text-zinc-400 mb-4">No machines listed yet</p>
              <Link href="/equipment-owner/machines/new">
                <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">Add First Machine</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {equipment.slice(0, 5).map((machine) => (
                <div key={machine.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Tractor className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{machine.name}</h4>
                      <p className="text-sm text-zinc-500">{machine.category} • {machine.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${machine.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {machine.status}
                    </span>
                    <div className="text-right">
                      <p className="text-white font-medium">{machine.pricing?.dailyRate || "N/A"}</p>
                      <p className="text-xs text-zinc-500">per day</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings / Schedule */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold text-white">Upcoming Bookings</h2>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 space-y-5">
             <div className="text-zinc-500 text-sm text-center py-4">No upcoming bookings.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
