"use client";

import React, { useEffect, useState } from "react";
import { useProcurementStore } from "../../../stores/procurementStore";
import { ProcurementCommandPanel } from "@/components/procurement/ProcurementCommandPanel";
import { CinematicCheckout } from "@/components/marketplace/CinematicCheckout";
import {
  Package as PackageIcon,
  Truck as TruckIcon,
  ClipboardList as ClipboardListIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  Building2 as Building2Icon,
  IndianRupee as IndianRupeeIcon,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
const Package = PackageIcon as any;
const Truck = TruckIcon as any;
const ClipboardList = ClipboardListIcon as any;
const Check = CheckIcon as any;
const Search = SearchIcon as any;
const Building2 = Building2Icon as any;
const IndianRupee = IndianRupeeIcon as any;
const RefreshCw = RefreshCwIcon as any;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-500/20 text-slate-400",
  PENDING: "bg-amber-500/20 text-amber-400",
  APPROVED: "bg-emerald-500/20 text-emerald-400",
  PARTIAL_RECEIVED: "bg-blue-500/20 text-blue-400",
  RECEIVED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-rose-500/20 text-rose-400",
};

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="glass-panel bg-black/40 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg transition-shadow">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

type Tab = "suppliers" | "orders";

export default function ProcurementPage() {
  const { suppliers,
    purchaseOrders,
    supplierStats,
    purchaseStats,
    isLoading,
    fetchSuppliers,
    fetchPurchaseOrders,
    fetchSupplierStats,
    fetchPurchaseStats,
    approvePurchaseOrder } = useProcurementStore() as any;

  const [activeTab, setActiveTab] = useState<Tab>("suppliers");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchPurchaseOrders();
    fetchSupplierStats();
    fetchPurchaseStats();
  }, []);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "suppliers", label: "Suppliers", icon: Building2 },
    { key: "orders", label: "Purchase Orders", icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Procurement{" "}
            <span className="text-primary">Hub</span>
          </h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            Enterprise Supply Chain & RFQ Orchestration
          </p>
        </div>
        <button
          onClick={() => {
            fetchSuppliers();
            fetchPurchaseOrders();
            fetchSupplierStats();
            fetchPurchaseStats();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-mono font-bold hover:bg-primary/20 transition-colors uppercase tracking-widest"
        >
          <RefreshCw className="w-4 h-4" /> Sync Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <StatCard
          icon={Building2}
          label="Total Suppliers"
          value={supplierStats?.totalSuppliers || 0}
          sub={`${supplierStats?.activeSuppliers || 0} active`}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={ClipboardList}
          label="Purchase Orders"
          value={purchaseStats?.totalPurchaseOrders || 0}
          sub={`${purchaseStats?.pendingPurchaseOrders || 0} pending`}
          color="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={Truck}
          label="GRN Today"
          value={purchaseStats?.goodsReceivedToday || 0}
          sub="Received today"
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Purchases"
          value={formatCurrency(purchaseStats?.totalPurchaseValue || 0)}
          sub="All time value"
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Controls */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all ${
                      activeTab === tab.key
                        ? "bg-primary text-black"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-lg w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === "suppliers" ? "Search suppliers..." : "Search PO number..."
                }
                className="bg-transparent border-none text-xs font-mono text-white placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto glass-panel bg-black/40 border border-white/10 rounded-xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-t-primary border-white/10 rounded-full animate-spin" />
              </div>
            ) : activeTab === "suppliers" ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-10">
                  <tr>
                    <th className="text-left p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Supplier
                    </th>
                    <th className="text-left p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Type
                    </th>
                    <th className="text-left p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="text-right p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Due Amount
                    </th>
                    <th className="text-center p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers
                    .filter(
                      (s: any) => !search || s.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((s: any) => (
                      <tr
                        key={s.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          {s.companyName && (
                            <p className="text-[10px] font-mono text-slate-500 uppercase">
                              {s.companyName}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400 uppercase tracking-widest border border-blue-500/20">
                            {s.supplierType}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-400">{s.mobile}</td>
                        <td className="p-4 text-right text-sm font-mono text-white">
                          {formatCurrency(s.totalDue)}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`text-[10px] font-mono px-2 py-1 rounded uppercase tracking-widest border ${s.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
                          >
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {suppliers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-12 text-center text-slate-500 text-sm font-mono uppercase tracking-widest"
                      >
                        No suppliers registered
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-10">
                  <tr>
                    <th className="text-left p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      PO Number
                    </th>
                    <th className="text-left p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Supplier
                    </th>
                    <th className="text-right p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Total
                    </th>
                    <th className="text-center p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Items
                    </th>
                    <th className="text-center p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="text-center p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders
                    .filter(
                      (po: any) =>
                        !search || po.poNumber.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((po: any) => (
                      <tr
                        key={po.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-xs font-mono font-bold text-amber-500">
                          {po.poNumber}
                        </td>
                        <td className="p-4 text-sm text-white">{po.supplier?.name || "—"}</td>
                        <td className="p-4 text-right text-sm font-mono text-white">
                          {formatCurrency(po.grandTotal)}
                        </td>
                        <td className="p-4 text-center text-xs font-mono text-slate-400">
                          {po._count?.items || 0}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`text-[10px] font-mono px-2 py-1 rounded uppercase tracking-widest border border-white/10 ${statusColors[po.status] || "bg-slate-500/20 text-slate-400"}`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {(po.status === "DRAFT" || po.status === "PENDING") && (
                            <button
                              onClick={() => approvePurchaseOrder(po.id)}
                              className="text-[10px] font-mono px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded uppercase tracking-widest hover:bg-emerald-500/20 transition"
                            >
                              <Check className="w-3 h-3 inline mr-1" /> Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  {purchaseOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-12 text-center text-slate-500 text-sm font-mono uppercase tracking-widest"
                      >
                        No purchase orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
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
