"use client";

import React, { useEffect, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@constructos/ui";
import {
  HardHat as HardHatIcon,
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  MapPin as MapPinIcon,
  Wallet as WalletIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
} from "lucide-react";
const HardHat = HardHatIcon as any;
const Activity = ActivityIcon as any;
const CheckCircle = CheckCircleIcon as any;
const MapPin = MapPinIcon as any;
const Wallet = WalletIcon as any;
const Plus = PlusIcon as any;
const Search = SearchIcon as any;

export default function ProjectsPage() {
  const { projects, stats, isLoading, fetchProjects, fetchStats } = useProjectStore() as any;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [fetchProjects, fetchStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects({ search: searchTerm });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PLANNING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "COMPLETED":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "ON_HOLD":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" />
            Contractor ERP
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise project & site management engine.
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Projects</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats?.activeProjects || 0}
              </h3>
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
                {stats?.completedProjects || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Workers</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats?.totalWorkers || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-500">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Portfolio Spent</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {(stats?.totalActualCost || 0).toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Project Portfolio
            </CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
              Loading portfolio data...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-4 my-4 rounded-xl">
              <HardHat className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-20" />
              <p>No projects found. Create your first project to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Budget</th>
                    <th className="px-6 py-4 text-right">Actual Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {projects.map((project: any) => {
                    const costPercent =
                      project.estimatedBudget > 0
                        ? Math.round((project.actualCost / project.estimatedBudget) * 100)
                        : 0;
                    const isOverBudget = project.actualCost > project.estimatedBudget;

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-1">
                            {project.projectCode} • {project.projectType}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {project.customer?.name || "Internal"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {project.city || "Not specified"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getStatusColor(project.projectStatus)}`}
                          >
                            {project.projectStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                          {project.estimatedBudget.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`font-bold ${isOverBudget ? "text-rose-500" : "text-emerald-500"}`}
                          >
                            {project.actualCost.toLocaleString()}
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{ width: `${Math.min(costPercent, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {costPercent}% utilized
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
