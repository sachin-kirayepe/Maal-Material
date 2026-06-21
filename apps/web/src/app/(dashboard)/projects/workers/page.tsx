"use client";

import React, { useEffect, useState } from "react";
import { useWorkerStore } from "@/stores/workerStore";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@constructos/ui";
import {
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
} from "lucide-react";
const Users = UsersIcon as any;
const UserCheck = UserCheckIcon as any;
const Plus = PlusIcon as any;
const Search = SearchIcon as any;

export default function WorkersPage() {
  const { workers, skillBreakdown, isLoading, fetchWorkers, fetchSkillBreakdown } = useWorkerStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkers();
    fetchSkillBreakdown();
  }, [fetchWorkers, fetchSkillBreakdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers({ search: searchTerm });
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case "SUPERVISOR":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "MASON":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "ELECTRICIAN":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PLUMBER":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "WELDER":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "HELPER":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            Labor Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage construction workers, skill profiles, and project assignments.
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Onboard Worker
        </Button>
      </div>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skillBreakdown.length > 0 ? (
          skillBreakdown.map((skill: any) => (
            <Card
              key={skill.skillType}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800"
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                  {skill.skillType}
                </h4>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{skill.count}</p>
                <div className="mt-2 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  Avg: ₹{skill.avgDailyWage}/day
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800 col-span-full">
            <CardContent className="p-4 text-center text-sm text-slate-500 py-6">
              No skill breakdown data available.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Worker List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              Worker Registry
            </CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workers by name or mobile..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-72"
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
              Loading worker data...
            </div>
          ) : workers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-4 my-4 rounded-xl">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-20" />
              <p>No workers found. Register your labor force to begin attendance tracking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Worker Profile</th>
                    <th className="px-6 py-4">Skill Type</th>
                    <th className="px-6 py-4">Current Assignment</th>
                    <th className="px-6 py-4">Contractor</th>
                    <th className="px-6 py-4 text-right">Daily Wage</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {workers.map((worker) => (
                    <tr
                      key={worker.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {worker.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {worker.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                              {worker.mobile}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getSkillColor(worker.skillType)}`}
                        >
                          {worker.skillType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {worker.project ? (
                          <div className="text-slate-900 dark:text-white font-medium">
                            {worker.project.name}
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {worker.project.projectCode}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {worker.contractorName || (
                          <span className="text-slate-400 italic text-xs">Direct Hire</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                        ₹{worker.dailyWage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {worker.isActive ? (
                          <div className="inline-flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> INACTIVE
                          </div>
                        )}
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
