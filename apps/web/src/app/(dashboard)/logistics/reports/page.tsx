"use client";

import React from "react";
import {
  BarChart3 as BarChart3Icon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
} from "lucide-react";
const BarChart3 = BarChart3Icon as any;
const TrendingUp = TrendingUpIcon as any;
const TrendingDown = TrendingDownIcon as any;
const Truck = TruckIcon as any;
const Package = PackageIcon as any;
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@constructos/ui";
import { useLogisticsStore } from "@/stores/logisticsStore";
import { GradientAreaChart } from "@/components/ui/GradientAreaChart";
import { DonutChart } from "@/components/ui/DonutChart";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function LogisticsReportsPage() {
  const { dispatches, vehicles, isLoading, fetchDispatches, fetchVehicles } = useLogisticsStore();

  React.useEffect(() => {
    fetchDispatches();
    fetchVehicles();
  }, [fetchDispatches, fetchVehicles]);

  // Calculate real metrics from store data
  const totalDeliveries = dispatches.length;
  const completedDeliveries = dispatches.filter((d: any) => d.status === "DELIVERED" || d.status === "COMPLETED").length;
  const onTimeRate = totalDeliveries > 0
    ? ((completedDeliveries / totalDeliveries) * 100).toFixed(1)
    : "0.0";
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v: any) => v.status === "ACTIVE" || v.status === "IN_TRANSIT").length;
  const fleetUtilization = totalVehicles > 0
    ? Math.round((activeVehicles / totalVehicles) * 100)
    : 0;

  // Build chart data from dispatches
  const volumeChartData = React.useMemo(() => {
    if (dispatches.length === 0) return [];
    const grouped: Record<string, number> = {};
    dispatches.forEach((d: any) => {
      const date = d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "Unknown";
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [dispatches]);

  const costChartData = React.useMemo(() => {
    if (dispatches.length === 0) return [];
    const zoneMap: Record<string, number> = {};
    dispatches.forEach((d: any) => {
      const zone = d.region || d.zone || d.destination || "Other";
      zoneMap[zone] = (zoneMap[zone] || 0) + (d.cost || d.shippingCost || 0);
    });
    return Object.entries(zoneMap).map(([name, value]) => ({ name, value }));
  }, [dispatches]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Logistics Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Fleet utilization, delivery performance, and cost reporting.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Deliveries (MTD)</p>
                  <p className="text-3xl font-bold mt-2">{totalDeliveries.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-500">
                {completedDeliveries} completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">On-Time Delivery Rate</p>
                  <p className="text-3xl font-bold mt-2">{onTimeRate}%</p>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600">
                Based on {totalDeliveries} deliveries
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Fleet Utilization</p>
                  <p className="text-3xl font-bold mt-2">{fleetUtilization}%</p>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-500">{activeVehicles} of {totalVehicles} vehicles active</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Fleet</p>
                  <p className="text-3xl font-bold mt-2">{totalVehicles}</p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-500">
                Registered vehicles
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Volume Trends</CardTitle>
            <CardDescription>Completed deliveries over recent period</CardDescription>
          </CardHeader>
          <CardContent>
            {volumeChartData.length > 0 ? (
              <GradientAreaChart data={volumeChartData} color="#3b82f6" height={288} />
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No delivery data available yet. Dispatch deliveries to see trends.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Region</CardTitle>
            <CardDescription>Logistics expenditure broken down by shipping zone</CardDescription>
          </CardHeader>
          <CardContent>
            {costChartData.length > 0 ? (
              <DonutChart data={costChartData} height={288} />
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No cost data available yet. Cost breakdowns appear as deliveries complete.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
