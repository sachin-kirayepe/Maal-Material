"use client";

import React from "react";
import {
  BarChart3 as BarChart3Icon,
  TrendingUp as TrendingUpIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
} from "lucide-react";
const BarChart3 = BarChart3Icon as any;
const TrendingUp = TrendingUpIcon as any;
const Truck = TruckIcon as any;
const Package = PackageIcon as any;
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@constructos/ui";

export default function LogisticsReportsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Deliveries (MTD)</p>
                <p className="text-3xl font-bold mt-2">1,248</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">On-Time Delivery Rate</p>
                <p className="text-3xl font-bold mt-2">94.2%</p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Fleet Utilization</p>
                <p className="text-3xl font-bold mt-2">78%</p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">Optimal target: 85%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg. Cost per km</p>
                <p className="text-3xl font-bold mt-2">₹14.50</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-rose-500">
              <TrendingUp className="w-4 h-4 mr-1" /> +₹1.20 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Volume Trends</CardTitle>
            <CardDescription>Daily completed deliveries over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              [Volume Chart Widget]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Region</CardTitle>
            <CardDescription>Logistics expenditure broken down by shipping zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              [Cost Distribution Chart Widget]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
