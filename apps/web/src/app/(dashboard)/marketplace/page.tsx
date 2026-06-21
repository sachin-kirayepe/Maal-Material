"use client";

import React from "react";
import { IndustrialCatalogGrid } from "@/components/marketplace/IndustrialCatalogGrid";
import { ProcurementCommandPanel } from "@/components/procurement/ProcurementCommandPanel";
import { CinematicCheckout } from "@/components/marketplace/CinematicCheckout";
import { useInventoryStream } from "@/hooks/useInventoryStream";
import {
  ShieldCheck as ShieldCheckIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
} from "lucide-react";
const ShieldCheck = ShieldCheckIcon as any;
const Database = DatabaseIcon as any;
const Network = NetworkIcon as any;

export default function MarketplacePage() {
  // Activate high-frequency websocket simulation for live inventory & pricing
  useInventoryStream();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" /> Global Industrial Exchange
          </h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            Live Economic Ecosystem • B2B Procurement Hub
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
            <Database className="w-3 h-3" /> Sync: Optimal
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono tracking-widest uppercase">
            <ShieldCheck className="w-3 h-3" /> Enterprise Authorized
          </div>
        </div>
      </div>

      {/* Main Orchestration Layout */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Catalog Section */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <IndustrialCatalogGrid />
        </div>

        {/* Procurement Command Section */}
        <div className="w-[400px] shrink-0 h-full">
          <ProcurementCommandPanel />
        </div>
      </div>

      <CinematicCheckout />
    </div>
  );
}
