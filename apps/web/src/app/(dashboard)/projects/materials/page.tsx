"use client";

import React, { useEffect, useState } from "react";
import { useMaterialStore } from "@/stores/materialStore";
import { Card, CardHeader, CardTitle, Button } from "@constructos/ui";
import {
  Package as PackageIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Truck as TruckIcon,
  ArrowRightLeft as ArrowRightLeftIcon,
  Activity as ActivityIcon,
} from "lucide-react";
const Package = PackageIcon as any;
const Search = SearchIcon as any;
const Plus = PlusIcon as any;
const Truck = TruckIcon as any;
const ArrowRightLeft = ArrowRightLeftIcon as any;
const Activity = ActivityIcon as any;

export default function MaterialsPage() {
  const { consumptions, transfers, isLoading, fetchConsumptions, fetchTransfers } = useMaterialStore() as any;
  const [activeTab, setActiveTab] = useState<"CONSUMPTION" | "TRANSFERS">("CONSUMPTION");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConsumptions();
    fetchTransfers();
  }, [fetchConsumptions, fetchTransfers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            Material & Inventory Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track material consumption, wastage, and inter-site transfers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            New Transfer
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Record Consumption
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("CONSUMPTION")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "CONSUMPTION"
              ? "border-amber-500 text-amber-600 dark:text-amber-500"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Consumption Logs
        </button>
        <button
          onClick={() => setActiveTab("TRANSFERS")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "TRANSFERS"
              ? "border-amber-500 text-amber-600 dark:text-amber-500"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Site Transfers
        </button>
      </div>

      {/* Content */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {activeTab === "CONSUMPTION" ? (
                <>
                  <Activity className="w-5 h-5 text-amber-500" /> Usage History
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 text-amber-500" /> Transfer History
                </>
              )}
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-t-amber-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin mb-4"></div>
              Loading data...
            </div>
          ) : activeTab === "CONSUMPTION" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Material</th>
                    <th className="px-6 py-4">Site</th>
                    <th className="px-6 py-4 text-right">Quantity Used</th>
                    <th className="px-6 py-4 text-right">Wastage</th>
                    <th className="px-6 py-4 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {consumptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No consumption records found.
                      </td>
                    </tr>
                  ) : (
                    consumptions.map((item: any) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {new Date(item.consumedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {item.productName}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            SKU: {item.sku}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {item.site?.name}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-rose-500">
                          {item.wastageQty > 0 ? item.wastageQty : "-"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                          ₹{item.totalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Transfer #</th>
                    <th className="px-6 py-4">Material</th>
                    <th className="px-6 py-4">From</th>
                    <th className="px-6 py-4">To Site</th>
                    <th className="px-6 py-4 text-right">Quantity</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No transfer records found.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((item: any) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs">{item.transferNumber}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {item.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {item.fromWarehouse?.name || item.fromSite?.name || "Direct"}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {item.toSite?.name}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                              item.status === "RECEIVED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
