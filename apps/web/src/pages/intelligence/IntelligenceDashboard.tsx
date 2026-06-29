import React from "react";
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";
import {
  Activity as ActivityIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  ShieldAlert as ShieldAlertIcon,
} from "lucide-react";

const LineChart = RechartsLineChart as any;
const Line = RechartsLine as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const ResponsiveContainer = RechartsResponsiveContainer as any;
const Legend = RechartsLegend as any;

const Activity = ActivityIcon as any;
const Settings = SettingsIcon as any;
const Download = DownloadIcon as any;
const TrendingUp = TrendingUpIcon as any;
const ShieldAlert = ShieldAlertIcon as any;


const data = [
  { name: "Mon", revenue: 4000, deliveries: 24, expenses: 2400 },
  { name: "Tue", revenue: 3000, deliveries: 13, expenses: 1398 },
  { name: "Wed", revenue: 2000, deliveries: 45, expenses: 9800 },
  { name: "Thu", revenue: 2780, deliveries: 39, expenses: 3908 },
  { name: "Fri", revenue: 1890, deliveries: 48, expenses: 4800 },
  { name: "Sat", revenue: 2390, deliveries: 38, expenses: 3800 },
  { name: "Sun", revenue: 3490, deliveries: 43, expenses: 4300 },
];

const anomalies = [
  {
    id: 1,
    type: "DUPLICATE_DISPATCH",
    severity: "CRITICAL",
    description: "Order ORD-102 dispatched twice within 1 hour.",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "NEGATIVE_STOCK",
    severity: "HIGH",
    description: "Warehouse A stock for Item 45 dropped below 0.",
    time: "1 hr ago",
  },
];

export default function IntelligenceDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            Enterprise Intelligence
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time KPI tracking, anomaly detection, and predictive analytics.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Settings className="h-4 w-4" />
            Rules Engine
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Monthly Revenue", value: "$248,500", trend: "+14%", color: "text-green-600" },
          { title: "Active Deliveries", value: "1,240", trend: "+5%", color: "text-blue-600" },
          { title: "Project Expenses", value: "$84,300", trend: "-2%", color: "text-red-600" },
          { title: "Rule Interventions", value: "42", trend: "+12%", color: "text-orange-600" },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {kpi.title}
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
              <span className={`text-sm font-medium ${kpi.color}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              Financial Trends (7 Days)
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Risk & Anomalies
            </h2>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {anomalies.length} New
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-4 rounded-lg bg-red-50 border border-red-100 relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-red-900">{anomaly.type}</span>
                    <span className="text-xs text-red-600 font-medium">{anomaly.time}</span>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed">{anomaly.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-6 w-full py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
}
