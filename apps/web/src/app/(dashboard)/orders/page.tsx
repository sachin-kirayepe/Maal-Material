"use client";

import React, { useEffect, useState } from "react";
import { useOMSStore } from "../../../stores/omsStore";
import {
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  PackageCheck as PackageCheckIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  CheckCircle2 as CheckCircle2Icon,
  XCircle as XCircleIcon,
} from "lucide-react";
import LinkImport from "next/link";

const ShoppingCart = ShoppingCartIcon as any;
const TrendingUp = TrendingUpIcon as any;
const PackageCheck = PackageCheckIcon as any;
const Clock = ClockIcon as any;
const Eye = EyeIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;
const XCircle = XCircleIcon as any;
const Link = LinkImport as any;

export default function OMSDashboard() {
  const { orders, isLoading, fetchOrders, stats, updateOrderStatus } = useOMSStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.orderStatus === "PENDING";
    if (activeTab === "fulfilled") return order.fulfillmentStatus === "FULFILLED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold tracking-wider">
            CONFIRMED
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold tracking-wider">
            PENDING
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold tracking-wider">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[10px] font-bold tracking-wider">
            {status}
          </span>
        );
    }
  };

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return (
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold tracking-wider">
            FULFILLED
          </span>
        );
      case "UNFULFILLED":
        return (
          <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[10px] font-bold tracking-wider">
            UNFULFILLED
          </span>
        );
      case "PARTIAL":
        return (
          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-500 rounded-full text-[10px] font-bold tracking-wider">
            PARTIAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[10px] font-bold tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            OMS Command Center
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Enterprise Order Management & Fulfillment
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all">
            Process Fulfillment
          </button>
          <a
            href="/checkout"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg text-sm font-black shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center gap-2"
          >
            Create Order
          </a>
        </div>
      </div>

      {/* KPI WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Orders
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.totalOrders}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Pending Processing
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.pendingOrders}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Fulfilled
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.fulfilledOrders}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Avg Order Value
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.averageOrderValue.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-800 flex bg-slate-50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Pending Processing
          </button>
          <button
            onClick={() => setActiveTab("fulfilled")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "fulfilled"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Fulfilled
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">No orders found.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Fulfillment
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {order.customer?.companyName || order.customer?.name || "N/A"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {order.grandTotal.toLocaleString()}
                    </td>
                    <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4">{getFulfillmentBadge(order.fulfillmentStatus)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {order.orderStatus === "PENDING" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Confirm Order"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {order.orderStatus === "PENDING" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={`/orders/${order.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
