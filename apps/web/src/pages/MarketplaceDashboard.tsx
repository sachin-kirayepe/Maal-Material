"use client";

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  FileText as FileTextIcon,
  TrendingUp as TrendingUpIcon,
  ShieldCheck as ShieldCheckIcon,
} from "lucide-react";
const ShoppingCart = ShoppingCartIcon as any;
const Store = StoreIcon as any;
const FileText = FileTextIcon as any;
const TrendingUp = TrendingUpIcon as any;
const ShieldCheck = ShieldCheckIcon as any;

import { useMarketplaceStore } from "../stores/marketplaceStore";
import { useVendorNetworkStore } from "../stores/vendorNetworkStore";
import { useRfqExchangeStore } from "../stores/rfqExchangeStore";
import { useCommerceIntelligenceStore } from "../stores/commerceIntelligenceStore";

export default function MarketplaceDashboard() {
  const { storefronts, orders, fetchStorefronts, fetchOrders } = useMarketplaceStore();
  const { fetchVendors } = useVendorNetworkStore();
  const { rfqs, fetchRfqs } = useRfqExchangeStore();
  const { analytics, fetchAnalytics } = useCommerceIntelligenceStore();

  useEffect(() => {
    fetchStorefronts();
    fetchOrders();
    fetchVendors();
    fetchRfqs("GLOBAL");
    fetchAnalytics();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent blur-[100px] -z-10 rounded-full" />

      <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 tracking-tight">
            Industrial Commerce Exchange
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            B2B Marketplace & Ecosystem Intelligence
          </p>
        </div>
        <Badge
          variant="default"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 text-sm shadow-lg shadow-indigo-500/25 border-0 rounded-xl transition-all hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Enterprise Ecosystem Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 rounded-3xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Orders
            </CardTitle>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalOrders || 0}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Processed across ecosystem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 rounded-3xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:w-2 transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              GMV
            </CardTitle>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ${(analytics?.grossMerchandiseValue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Total transaction volume
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 rounded-3xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 group-hover:w-2 transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active RFQs
            </CardTitle>
            <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalRfqs || 0}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Open digital exchanges
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 rounded-3xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 group-hover:w-2 transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Verified Vendors
            </CardTitle>
            <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalVendors || 0}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Enterprise network size
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
            <CardTitle className="text-lg font-bold flex items-center text-slate-800 dark:text-slate-100">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg mr-3">
                <Store className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              Vendor Storefronts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Store Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Vendor
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Min Order
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Currencies
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storefronts.map((store) => (
                  <TableRow
                    key={store.id}
                    className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                      {store.storeName}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {store.vendor?.vendorName}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 font-medium">
                      ${store.minOrderValue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {store.supportedCurrencies}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
            <CardTitle className="text-lg font-bold flex items-center text-slate-800 dark:text-slate-100">
              <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              </div>
              Active RFQ Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    RFQ Code
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Budget
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow
                    key={rfq.id}
                    className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-500 dark:text-slate-400">
                      {(rfq as any).rfqCode}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                      {rfq.title}
                    </TableCell>
                    <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ${(rfq as any).budgetMax?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-blue-100/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-none shadow-none font-medium"
                      >
                        {rfq.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-3xl overflow-hidden md:col-span-2">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
            <CardTitle className="text-lg font-bold flex items-center text-slate-800 dark:text-slate-100">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg mr-3">
                <ShoppingCart className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              Recent B2B Commerce Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Order #
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Vendor
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Total Amount
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Fulfillment
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Payment
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 dark:text-slate-400 py-4">
                    Expected Delivery
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {order.vendor?.vendorName}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-white">
                      ${order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 shadow-none font-medium"
                      >
                        {order.fulfillmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 shadow-none font-medium"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(order.expectedDelivery).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
