"use client";

import React, { useEffect } from "react";
import { Truck as TruckIcon, Search as SearchIcon, Plus as PlusIcon } from "lucide-react";
const Truck = TruckIcon as any;
const Search = SearchIcon as any;
const Plus = PlusIcon as any;
import { Button, Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import { useLogisticsStore } from "../../../../stores/logisticsStore";

export default function FleetPage() {
  const { vehicles, fetchVehicles, isLoading } = useLogisticsStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Fleet Registry
          </h1>
          <p className="text-sm text-slate-500">
            Manage vehicles, capacities, and operational status.
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Vehicles</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search fleet..."
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
                    Vehicle No
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Make/Model
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Capacity
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
                      Loading fleet...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-500 flex flex-col items-center"
                    >
                      <Truck className="w-8 h-8 mb-2 opacity-50" />
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-xs">{vehicle.vehicleNumber}</td>
                      <td className="p-4">{vehicle.type}</td>
                      <td className="p-4">
                        {vehicle.make} {vehicle.model}
                      </td>
                      <td className="p-4">{vehicle.capacity} tons</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${
                            vehicle.operationalStatus === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : vehicle.operationalStatus === "MAINTENANCE"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                          }`}
                        >
                          {vehicle.operationalStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
