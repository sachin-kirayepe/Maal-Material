"use client";

import React from "react";
// framer-motion not used
import { Route, Truck, PackageCheck, Factory, Warehouse, Building2, Search } from "lucide-react";
import { useSupplyChainStore } from "../../../stores/supplyChainStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function SupplyChainMap() {
  const tenantId = useTenantId();
  const { logistics, isLoading, fetchLogistics } = useSupplyChainStore();

  React.useEffect(() => {
    fetchLogistics(tenantId);
  }, [fetchLogistics]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Route className="text-blue-500" size={28} /> End-to-End Supply Chain Map
          </h1>
          <p className="text-zinc-400">Visualize active material flows, warehouse capacities, and live transit routes.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search shipments, POs, or nodes..." 
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-blue-500 w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map Visualization Area */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden h-[650px]">
          {/* Abstract Grid Map Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dot-noise.png')] opacity-20"></div>
          
          <div className="relative w-full h-full">
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-black/50 border border-zinc-800 backdrop-blur-md p-3 rounded-xl text-xs space-y-2 z-30">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Manufacturers</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Dist. Hubs</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Active Sites</div>
              <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-blue-500 border border-dashed"></div> In Transit</div>
            </div>

            {/* Hub 1: Manufacturer */}
            <div className="absolute top-1/4 left-[10%] -translate-x-1/2 -translate-y-1/2 z-20 group">
              <div className="w-16 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Factory size={24} className="text-blue-400" />
              </div>
              <div className="absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 text-center bg-black/80 px-2 py-1 rounded text-xs border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-medium text-white">Jindal Steel Plant</p>
                <p className="text-zinc-400">Raigarh, CG</p>
              </div>
            </div>

            {/* Hub 2: Central Warehouse */}
            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 z-20 group">
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <Warehouse size={32} className="text-amber-400" />
              </div>
              <div className="absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 text-center bg-black/80 px-2 py-1 rounded text-xs border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-medium text-white">Bhiwandi Central Hub</p>
                <p className="text-zinc-400">Capacity: 85% Full</p>
              </div>
            </div>

            {/* Hub 3: Construction Site A */}
            <div className="absolute top-1/3 right-[15%] translate-x-1/2 -translate-y-1/2 z-20 group">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Building2 size={24} className="text-green-400" />
              </div>
              <div className="absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 text-center bg-black/80 px-2 py-1 rounded text-xs border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-medium text-white">Project Alpha (BKC)</p>
                <p className="text-zinc-400">Awaiting 4 Deliveries</p>
              </div>
            </div>

            {/* Hub 4: Construction Site B */}
            <div className="absolute bottom-1/4 right-[25%] translate-x-1/2 translate-y-1/2 z-20 group">
              <div className="w-14 h-14 bg-green-500/20 border-2 border-green-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <Building2 size={20} className="text-green-400" />
              </div>
            </div>

            {/* Routes and Animations */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Manufacturer to Central Hub */}
              <path id="route1" d="M 10% 25% Q 25% 45% 40% 50%" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,6" className="opacity-50" />
              <circle r="4" fill="#60a5fa" filter="drop-shadow(0 0 4px #60a5fa)">
                <animateMotion dur="4s" repeatCount="indefinite">
                  <mpath href="#route1"/>
                </animateMotion>
              </circle>

              {/* Central Hub to Site A */}
              <path id="route2" d="M 40% 50% Q 60% 30% 85% 33%" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" className="opacity-50" />
              <circle r="4" fill="#fbbf24" filter="drop-shadow(0 0 4px #fbbf24)">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href="#route2"/>
                </animateMotion>
              </circle>

              {/* Central Hub to Site B */}
              <path id="route3" d="M 40% 50% Q 55% 75% 75% 75%" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" className="opacity-50" />
              <circle r="4" fill="#fbbf24" filter="drop-shadow(0 0 4px #fbbf24)">
                <animateMotion dur="5s" repeatCount="indefinite" begin="1s">
                  <mpath href="#route3"/>
                </animateMotion>
              </circle>
            </svg>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg">Active Flow Status</h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-zinc-500 text-center py-4">Tracking active routes...</div>
              ) : logistics.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 border border-dashed border-zinc-800 rounded-xl">No active logistics routes found.</div>
              ) : (
                logistics.map((route: any) => (
                  <div key={route.id} className="bg-black border border-zinc-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={16} className={route.status === "DISPATCHED" ? "text-blue-400" : "text-amber-400"} />
                      <p className="font-medium text-sm text-white">{route.transporterId || "Unassigned"} ({route.status})</p>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{route.origin} → {route.destination}</p>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${route.status === "DISPATCHED" ? "bg-blue-500 w-[60%]" : "bg-amber-500 w-[10%]"}`}></div>
                    </div>
                    <p className="text-[10px] text-zinc-500 text-right mt-1">Ref: {route.referenceId}</p>
                  </div>
                ))
              )}

              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <PackageCheck size={16} className="text-red-400" />
                  <p className="font-medium text-sm text-red-400">Shortage Alert</p>
                </div>
                <p className="text-xs text-red-400/70">Project Beta reported 15% shortage on Cement Batch #C-201. Re-routing required.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
