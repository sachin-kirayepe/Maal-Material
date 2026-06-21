"use client";

import React, { useEffect, useState } from "react";
import { useShopStore } from "@/stores/shopStore";
import { useTenantStore } from "@/stores/tenantStore";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@constructos/ui";
import {
  Store as StoreIcon,
  Plus as PlusIcon,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  Wrench as WrenchIcon,
} from "lucide-react";
const Store = StoreIcon as any;
const Plus = PlusIcon as any;
const MapPin = MapPinIcon as any;
const Building = BuildingIcon as any;
const Wrench = WrenchIcon as any;
import { useRouter } from "next/navigation";

export default function ShopsPage() {
  const router = useRouter();
  const { shops, fetchShops, isLoading } = useShopStore();
  const { tenants, fetchTenants } = useTenantStore();
  const [selectedTenant, setSelectedTenant] = useState<string>("");

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    // For demo purposes, we automatically select the first tenant to view its shops
    if (tenants.length > 0 && !selectedTenant) {
      const firstTenant = tenants[0]?.id;
      if (firstTenant) {
        setSelectedTenant(firstTenant);
        fetchShops(firstTenant);
      }
    } else if (selectedTenant) {
      fetchShops(selectedTenant);
    }
  }, [tenants, selectedTenant, fetchShops]);

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case "HARDWARE":
        return <Wrench className="w-4 h-4 text-slate-500" />;
      case "ELECTRICAL":
        return <Building className="w-4 h-4 text-amber-500" />;
      default:
        return <Store className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-500" />
            Shop Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage operational commerce hubs, retail branches, and supplier stores.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 outline-none"
          >
            <option value="" disabled>
              Select Organization Context
            </option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <Button
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => router.push("/shops/onboard")}
            disabled={!selectedTenant}
          >
            <Plus className="w-4 h-4" />
            Onboard Shop
          </Button>
        </div>
      </div>

      {/* Shops Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500">Loading shops infrastructure...</div>
      ) : shops.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
          No shops provisioned for this organization yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className="flex flex-col hover:border-amber-500/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/shops/${shop.id}`)}
            >
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {getBusinessIcon(shop.businessType)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{shop.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{shop.slug}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      shop.operationalStatus === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {shop.operationalStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <span>
                      {shop.address?.addressLine ? `${shop.address.addressLine}, ` : ""}
                      {shop.address?.city || "No city set"}
                      {shop.address?.state ? `, ${shop.address.state}` : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Active Staff
                      </p>
                      <p className="font-mono text-slate-900 dark:text-white font-medium mt-1">
                        {shop._count?.users || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        MP Listings
                      </p>
                      <p className="font-mono text-slate-900 dark:text-white font-medium mt-1">
                        {shop._count?.marketplaceListings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
