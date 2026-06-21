"use client";

import React, { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import {
  HardHat as HardHatIcon,
  MapPin as MapPinIcon,
  Activity as ActivityIcon,
  Wallet as WalletIcon,
  Briefcase as BriefcaseIcon,
  FileText as FileTextIcon,
} from "lucide-react";
const HardHat = HardHatIcon as any;
const MapPin = MapPinIcon as any;
const Activity = ActivityIcon as any;
const Wallet = WalletIcon as any;
const Briefcase = BriefcaseIcon as any;
const FileText = FileTextIcon as any;
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { currentProject, isLoading, fetchProjectById } = useProjectStore() as any;

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId, fetchProjectById]);

  if (isLoading || !currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-t-amber-500 border-slate-200 dark:border-slate-800 rounded-full animate-spin mb-4"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  const {
    name,
    projectCode,
    projectStatus,
    estimatedBudget,
    actualCost,
    customer,
    sites = [],
    expenses = [],
    costing,
    _count,
  } = currentProject || {};

  const costPercent = estimatedBudget > 0 ? (actualCost / estimatedBudget) * 100 : 0;
  const isOverBudget = actualCost > estimatedBudget;

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
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardHat className="w-6 h-6 text-amber-500" />
              {name}
            </h1>
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getStatusColor(projectStatus)}`}
            >
              {projectStatus}
            </span>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-4">
            <span className="font-mono">{projectCode}</span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />{" "}
              {customer?.companyName || customer?.name || "Internal"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Wallet className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Budget</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{estimatedBudget.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        <Card
          className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800 ${isOverBudget ? "border-rose-500/50 shadow-rose-500/10" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Activity
                className={`w-4 h-4 ${isOverBudget ? "text-rose-500" : "text-emerald-500"}`}
              />
              <span className="text-xs font-semibold uppercase tracking-wider">Actual Cost</span>
            </div>
            <h3
              className={`text-2xl font-black ${isOverBudget ? "text-rose-500" : "text-slate-900 dark:text-white"}`}
            >
              ₹{actualCost.toLocaleString()}
            </h3>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(costPercent, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Active Sites</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {_count?.sites || 0}
            </h3>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <HardHat className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Workers</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {_count?.workers || 0}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Costing Breakdown */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              Costing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {costing ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Material Costs
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{costing.materialCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${(costing.materialCost / actualCost) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Labor Costs
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{costing.laborCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(costing.laborCost / actualCost) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Operational & Equipment
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{costing.operationalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${(costing.operationalCost / actualCost) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">No costing data available yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Sites List */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Project Sites
            </CardTitle>
          </CardHeader>
          <div className="p-0">
            {sites.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                No sites mapped to this project.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sites.map((site: any) => (
                  <div
                    key={site.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">{site.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{site.siteCode}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {site.city}
                      {site.state ? `, ${site.state}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Expenses List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Recent Expenses Ledger
          </CardTitle>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No expenses recorded yet.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((expense: any) => (
                  <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
