"use client";

import React, { useEffect } from "react";
import LinkImport from "next/link";
const Link = LinkImport as any;
import {
  Navigation as NavigationIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
const Navigation = NavigationIcon as any;
const Truck = TruckIcon as any;
const Package = PackageIcon as any;
const Users = UsersIcon as any;
const Activity = ActivityIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const ArrowRight = ArrowRightIcon as any;
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@constructos/ui";
import { useDeliveryStore } from "../../../stores/deliveryStore";

export default function LogisticsDashboard() {
  const { stats, fetchStats, isLoading } = useDeliveryStore() as any;

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Logistics Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time delivery routing, fleet telematics, and warehouse dispatch orchestration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/logistics/deliveries">
            <Button variant="primary" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Manage Deliveries
            </Button>
          </Link>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/logistics/deliveries" className="group">
          <Card className="h-full transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer">
            <CardHeader>
              <Package className="w-8 h-8 text-amber-500 mb-2" />
              <CardTitle className="text-lg group-hover:text-amber-500 transition-colors">
                Deliveries
              </CardTitle>
              <CardDescription>Track outbound orders to construction sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats?.inTransit || 0}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    In Transit
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/logistics/dispatch" className="group">
          <Card className="h-full transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
            <CardHeader>
              <Activity className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg group-hover:text-blue-500 transition-colors">
                Warehouse Dispatch
              </CardTitle>
              <CardDescription>Manage picking, packing, and loading workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats?.pending || 0}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Pending Actions
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/logistics/fleet" className="group">
          <Card className="h-full transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer">
            <CardHeader>
              <Truck className="w-8 h-8 text-emerald-500 mb-2" />
              <CardTitle className="text-lg group-hover:text-emerald-500 transition-colors">
                Fleet Registry
              </CardTitle>
              <CardDescription>Monitor vehicles, capacities, and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">Active</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Operational Status
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/logistics/drivers" className="group">
          <Card className="h-full transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg group-hover:text-purple-500 transition-colors">
                Driver Roster
              </CardTitle>
              <CardDescription>Driver availability and assigned routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">Ready</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Driver Status
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Pipeline</CardTitle>
            <CardDescription>Real-time view of outbound materials</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Loading telemetrics...
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                Geospatial transit map will render here
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>Exceptions and delays requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.failed > 0 ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Failed Deliveries</div>
                    <div className="text-xs opacity-80 mt-1">
                      {stats.failed} deliveries require immediate action.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">All Systems Nominal</div>
                    <div className="text-xs opacity-80 mt-1">
                      No critical transit exceptions detected.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
