"use client";

import React, { useEffect } from "react";
import { useActivityStore } from "@/stores/activityStore";
import {
  Activity as ActivityIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  ShieldCheck as ShieldCheckIcon,
  Box as BoxIcon,
  FileText as FileTextIcon,
  User as UserIcon,
} from "lucide-react";
const Activity = ActivityIcon as any;
const Search = SearchIcon as any;
const Filter = FilterIcon as any;
const ShieldCheck = ShieldCheckIcon as any;
const Box = BoxIcon as any;
const FileText = FileTextIcon as any;
const User = UserIcon as any;
import { format } from "date-fns";

const ActionIcon = ({ action }: { action: string }) => {
  if (action.includes("ORDER") || action.includes("INVOICE"))
    return <FileText className="w-4 h-4" />;
  if (action.includes("STOCK")) return <Box className="w-4 h-4" />;
  if (action.includes("USER")) return <User className="w-4 h-4" />;
  return <ShieldCheck className="w-4 h-4" />;
};

export default function ActivityLogPage() {
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-500" />
            Audit & Activity Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System-wide immutable trail of all operations.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, entity or user..."
              className="bg-transparent border-none text-sm w-full focus:outline-none dark:text-white"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Entity</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No activity logs found for this tenant.
                  </td>
                </tr>
              ) : (
                activities.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <ActionIcon action={log.action} />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold uppercase">
                          {log.actor?.firstName?.charAt(0) || "?"}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">
                          {log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : "System"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                        {log.entityType}
                      </span>
                      <span className="ml-2 text-xs font-mono truncate max-w-[120px] inline-block align-bottom">
                        {log.entityId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-mono max-w-xs truncate">
                      {log.metadata || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
