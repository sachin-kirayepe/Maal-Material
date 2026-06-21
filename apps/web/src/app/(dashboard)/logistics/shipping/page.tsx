"use client";

import React, { useEffect, useState } from "react";
import {
  Map as MapIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  MapPin as MapPinIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const Map = MapIcon as any;
const Search = SearchIcon as any;
const Plus = PlusIcon as any;
const MapPin = MapPinIcon as any;
import { Button, Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import { useShippingStore } from "@/stores/shippingStore";

export default function ShippingZonesPage() {
  const { zones, meta, isLoading, fetchZones } = useShippingStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchZones(currentPage, 10);
  }, [fetchZones, currentPage]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shipping Zones
          </h1>
          <p className="text-sm text-slate-500">
            Configure delivery regions, pricing models, and routing boundaries.
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Zone
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Geographic Zones</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search zones..."
              className="bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none w-48"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Zone Name
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Code
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Base Cost
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Per Km Cost
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <Loader2 className="animate-spin text-amber-500 mx-auto mb-2" size={24} />
                      Loading zones...
                    </td>
                  </tr>
                ) : zones.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-500 flex flex-col items-center"
                    >
                      <Map className="w-8 h-8 mb-2 opacity-50" />
                      No zones configured.
                    </td>
                  </tr>
                ) : (
                  zones.map((zone: any) => (
                    <tr
                      key={zone.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" /> {zone.name}
                      </td>
                      <td className="p-4 font-mono text-xs">{zone.code}</td>
                      <td className="p-4">₹{zone.baseCost}</td>
                      <td className="p-4">₹{zone.perKmCost}/km</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${
                            zone.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {zone.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <span className="text-sm text-slate-500">
              {meta ? `Showing page ${meta.page} of ${meta.totalPages || 1}` : "Loading..."}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!!isLoading || currentPage === 1}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-slate-400" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!!isLoading || !!(meta && currentPage >= meta.totalPages)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
