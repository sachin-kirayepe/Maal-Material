import React from "react";
import { BarChart3 as BarChart3Icon } from "lucide-react";
const BarChart3 = BarChart3Icon as any;

export default function RegionalAnalyticsDashboard() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" /> Regional Analytics
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Macro-Economic Flow & Node Density</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            Total Exchange Value (7d)
          </h3>
          <p className="text-3xl font-extrabold text-gray-900">₹4.2 Cr</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            Active RFQs
          </h3>
          <p className="text-3xl font-extrabold text-gray-900">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            P2P Transfers
          </h3>
          <p className="text-3xl font-extrabold text-gray-900">38</p>
        </div>
      </div>
    </div>
  );
}
