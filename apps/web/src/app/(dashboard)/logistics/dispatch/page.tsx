"use client";

import React, { useEffect } from "react";
import {
  Activity as ActivityIcon,
  Search as SearchIcon,
  PackageCheck as PackageCheckIcon,
} from "lucide-react";
const Activity = ActivityIcon as any;
const Search = SearchIcon as any;
const PackageCheck = PackageCheckIcon as any;
import { Button, Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import { useLogisticsStore } from "../../../../stores/logisticsStore";

export default function DispatchPage() {
  const { dispatches, fetchDispatches, isLoading } = useLogisticsStore();

  useEffect(() => {
    fetchDispatches();
  }, [fetchDispatches]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Warehouse Dispatch
          </h1>
          <p className="text-sm text-slate-500">
            Manage picking, packing, and loading workflow for deliveries.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Active Dispatches</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search dispatches..."
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
                    Dispatch ID
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Items
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Loading dispatches...
                    </td>
                  </tr>
                ) : dispatches.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-500 flex flex-col items-center"
                    >
                      <Activity className="w-8 h-8 mb-2 opacity-50" />
                      No active dispatches.
                    </td>
                  </tr>
                ) : (
                  dispatches.map((dispatch) => (
                    <tr
                      key={dispatch.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-xs">{dispatch.dispatchNumber}</td>
                      <td className="p-4">{dispatch.warehouse?.name}</td>
                      <td className="p-4">{dispatch.delivery?.deliveryNumber}</td>
                      <td className="p-4">{dispatch.items?.length || 0} items</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${
                            dispatch.status === "PENDING"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : dispatch.status === "DISPATCHED"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {dispatch.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <PackageCheck className="w-3.5 h-3.5 mr-1" /> Manage
                        </Button>
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
