import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";
const PieChart = PieChartIcon as any;

export default function FleetAnalyticsCenter() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <PieChart className="w-8 h-8 mr-3 text-pink-600" /> Fleet Intelligence
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Predictive Demand & Utilization Analytics
          </p>
        </div>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rental Revenue (30 Days)</h3>
        <p className="text-5xl font-extrabold text-gray-900">₹14.2 L</p>
        <p className="text-sm font-bold text-green-600 mt-2">+12% from last month</p>
      </div>
    </div>
  );
}
