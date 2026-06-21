"use client";

import React, { useEffect } from "react";
import { useTenantStore } from "@/stores/tenantStore";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@constructos/ui";
import {
  Plus as PlusIcon,
  Building2 as Building2Icon,
  Store as StoreIcon,
  Activity as ActivityIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
const Plus = PlusIcon as any;
const Building2 = Building2Icon as any;
const Store = StoreIcon as any;
const Activity = ActivityIcon as any;
const AlertCircle = AlertCircleIcon as any;

import { useRouter } from "next/navigation";

export default function TenantsPage() {
  const router = useRouter();
  const { tenants, fetchTenants, platformAnalytics, fetchPlatformAnalytics, isLoading } = useTenantStore();

  useEffect(() => {
    fetchTenants();
    fetchPlatformAnalytics();
  }, [fetchTenants, fetchPlatformAnalytics]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" />
            Tenant Network
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage enterprise organizations, multi-shop operators, and platform subscriptions.
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4" />
          Provision Tenant
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Tenants</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {platformAnalytics?.totalTenants || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Active Subscriptions
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {platformAnalytics?.activeSubscriptions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Active Shops</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {platformAnalytics?.activeShops || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Suspended</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {(platformAnalytics?.totalTenants || 0) - (platformAnalytics?.activeTenants || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle>Network Organizations</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500">Organization Name</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Domain</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Active Plan</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Shops</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Loading network data...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No tenants registered yet.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {tenant.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{tenant.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {tenant.domain || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tenant.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tenant.subscriptions?.[0] ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                          {tenant.subscriptions[0].planName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {tenant._count?.shops || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tenants/${tenant.id}`)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
