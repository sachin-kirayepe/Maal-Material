"use client";

import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { Card, CardHeader, CardTitle, Button } from "@constructos/ui";
import {
  Activity as ActivityIcon,
  Clock as ClockIcon,
  CheckSquare as CheckSquareIcon,
  Search as SearchIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
const Activity = ActivityIcon as any;
const Clock = ClockIcon as any;
const CheckSquare = CheckSquareIcon as any;
const Search = SearchIcon as any;
const Calendar = CalendarIcon as any;

export default function AttendancePage() {
  const { records, isLoading, fetchRecords } = useAttendanceStore() as any;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming search would be handled via standard fetch or client-side filtering
    fetchRecords({ workerId: searchTerm });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "HALF_DAY":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "ABSENT":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "LEAVE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
            <Activity className="w-6 h-6 text-amber-500" />
            Labor Attendance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track worker attendance, shifts, and auto-calculate project labor costs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Daily Report
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            <CheckSquare className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Attendance List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Recent Logs
            </CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by worker ID..."
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
              Loading attendance records...
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-4 my-4 rounded-xl">
              <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-20" />
              <p>No attendance records found for the selected period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/50 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4">Site</th>
                    <th className="px-6 py-4">Shift</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Computed Wage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {records.map((record: any) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-900 dark:text-white font-medium">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {record.worker?.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {record.worker?.skillType} • {record.worker?.mobile}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {record.site?.name}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {record.site?.siteCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                        {record.shiftType.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getStatusColor(record.status)}`}
                        >
                          {record.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                        {record.wageAmount.toLocaleString()}
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
