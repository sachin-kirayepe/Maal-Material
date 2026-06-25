"use client";

import React from "react";
import { Store, Package, ShoppingCart, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";

export default function SMBDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your storefront, inventory, and orders.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0.00</div>
            <p className="text-xs text-slate-500 mt-1">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-slate-500 mt-1">0 pending dispatch</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Products Listed</CardTitle>
            <Package className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-slate-500 mt-1">0 low stock alerts</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Customers</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-slate-500 mt-1">0 new this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-slate-500 border-t border-slate-800/50">
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No recent orders found.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-slate-500 border-t border-slate-800/50">
            <div className="text-center">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Inventory levels look good.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
