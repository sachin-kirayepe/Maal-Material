"use client";

import React, { useEffect, useState } from "react";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@constructos/ui";
import {
  MapPin as MapPinIcon,
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  Package as PackageIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
} from "lucide-react";
const MapPin = MapPinIcon as any;
const Activity = ActivityIcon as any;
const CheckCircle = CheckCircleIcon as any;
const Package = PackageIcon as any;
const Plus = PlusIcon as any;
const Search = SearchIcon as any;

export default function SitesPage() {
  const { sites, isLoading, fetchSites } = useSiteStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSites({ search: searchTerm });
  };

  const activeSites = sites.filter((s: any) => s.siteStatus === "ACTIVE").length;
  const completedSites = sites.filter((s: any) => s.siteStatus === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-500" />
            Project Sites
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage distributed construction sites and their local inventory.
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Sites</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeSites}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {completedSites}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Managed Locations</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{sites.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Site Registry
            </CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sites..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
        </CardHeader>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-t-amber-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin mb-4"></div>
              Loading site data...
            </div>
          ) : sites.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-4 my-4 rounded-xl">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-20" />
              <p>No project sites found. Add a site to begin tracking local inventory and labor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Site Name</th>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Material SKUs</th>
                    <th className="px-6 py-4 text-center">Total Attendances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sites.map((site) => (
                    <tr
                      key={site.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {site.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{site.siteCode}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                        {site.project?.name || "Unassigned"}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {site.project?.projectCode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5 text-slate-600 dark:text-slate-300 text-xs">
                          <span>
                            {site.city}
                            {site.state ? `, ${site.state}` : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                            site.siteStatus === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : site.siteStatus === "COMPLETED"
                                ? "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {site.siteStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono text-xs">
                          <Package className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                          {site._count?.siteInventory || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono text-xs">
                          <Activity className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                          {site._count?.attendances || 0}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
