"use client";

import React, { useEffect } from "react";
import { Users as UsersIcon, Search as SearchIcon, Plus as PlusIcon } from "lucide-react";
const Users = UsersIcon as any;
const Search = SearchIcon as any;
const Plus = PlusIcon as any;
import { Button, Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import { useLogisticsStore } from "../../../../stores/logisticsStore";

export default function DriversPage() {
  const { drivers, fetchDrivers, isLoading } = useLogisticsStore();

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Driver Roster
          </h1>
          <p className="text-sm text-slate-500">
            Manage your delivery personnel and their availability.
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Drivers</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers..."
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
                    Driver Name
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    License No
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Loading drivers...
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-slate-500 flex flex-col items-center"
                    >
                      <Users className="w-8 h-8 mb-2 opacity-50" />
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-medium">{driver.name}</td>
                      <td className="p-4">{driver.mobile}</td>
                      <td className="p-4 font-mono text-xs">{driver.licenseNumber}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${
                            driver.availabilityStatus === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : driver.availabilityStatus === "ON_DELIVERY"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {driver.availabilityStatus}
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
