"use client";

import React, { useEffect } from "react";
import { useProjectCostingStore } from "@/stores/projectCostingStore";
import { Card, CardHeader, CardTitle, CardContent } from "@constructos/ui";
import {
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  AlertTriangle as AlertTriangleIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
} from "lucide-react";
const Wallet = WalletIcon as any;
const TrendingUp = TrendingUpIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const Activity = ActivityIcon as any;
const BarChart3 = BarChart3Icon as any;
const PieChart = PieChartIcon as any;

export default function CostingPage() {
  const { portfolio, isLoading, fetchPortfolioAnalytics } = useProjectCostingStore() as any;

  useEffect(() => {
    fetchPortfolioAnalytics();
  }, [fetchPortfolioAnalytics]);

  if (isLoading || !portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-t-amber-500 border-slate-200 dark:border-slate-800 rounded-full animate-spin mb-4"></div>
        <p>Crunching portfolio ledger analytics...</p>
      </div>
    );
  }

  const { summary, projectBreakdown, expenseBreakdown } = portfolio;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-500" />
            Project Costing Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time P&L, budget tracking, and intelligent cost overrun detection.
          </p>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Portfolio Budget
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{summary.totalBudget.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Actual Costs</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{summary.totalSpent.toLocaleString()}
            </h3>
            <div className="mt-2 text-xs text-slate-500">
              {summary.budgetUtilization}% of budget utilized
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800 ${summary.overBudgetCount > 0 ? "border-rose-500/50 shadow-rose-500/10" : ""}`}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <AlertTriangle
                className={`w-4 h-4 ${summary.overBudgetCount > 0 ? "text-rose-500" : "text-slate-400"}`}
              />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Over Budget Projects
              </span>
            </div>
            <h3
              className={`text-2xl font-black ${summary.overBudgetCount > 0 ? "text-rose-500" : "text-slate-900 dark:text-white"}`}
            >
              {summary.overBudgetCount}
            </h3>
            <div className="mt-2 text-xs text-slate-500">Needs immediate attention</div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800 bg-amber-500/5">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <PieChart className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Remaining Buffer
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(summary.totalBudget - summary.totalSpent).toLocaleString()}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Breakdown Table */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Project Level P&L
            </CardTitle>
          </CardHeader>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4 text-right">Budget</th>
                  <th className="px-6 py-4 text-right">Actual Cost</th>
                  <th className="px-6 py-4 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projectBreakdown.map((p: any) => {
                  const utilization =
                    p.estimatedBudget > 0 ? (p.actualCost / p.estimatedBudget) * 100 : 0;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {p.projectCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-300">
                        ₹{p.estimatedBudget.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`font-bold ${p.isOverBudget ? "text-rose-500" : "text-emerald-500"}`}
                        >
                          ₹{p.actualCost.toLocaleString()}
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${p.isOverBudget ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {p.isOverBudget ? "-" : "+"}₹{Math.abs(p.remainingBudget).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Expense Category Breakdown */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-500" />
              Expense Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {expenseBreakdown.map((exp: any) => {
                const percentage =
                  summary.totalSpent > 0 ? (exp.totalAmount / summary.totalSpent) * 100 : 0;
                return (
                  <div key={exp.type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {exp.type}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{exp.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 text-right">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}

              {expenseBreakdown.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  No expense data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
