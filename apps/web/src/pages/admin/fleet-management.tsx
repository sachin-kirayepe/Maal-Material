import React, { useEffect } from "react";
import { useFleetStore } from "../../stores/fleetStore";
import { Activity as ActivityIcon, Settings as SettingsIcon } from "lucide-react";
const Activity = ActivityIcon as any;
const Settings = SettingsIcon as any;

export default function FleetManagementDashboard() {
  const { stats, fetchStats, isLoading } = useFleetStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchStats(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Activity className="w-8 h-8 mr-3 text-cyan-600" /> Fleet Management
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Asset Utilization & Maintenance Tracking</p>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center p-8 text-gray-500">Calculating fleet metrics...</div>
      ) : (
        stats.map((stat) => (
          <div key={stat.id} className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Assets
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">{stat.totalAssets}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 text-green-600">
                Active Rentals
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">{stat.activeRentals}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 text-orange-600 flex items-center">
                <Settings className="w-4 h-4 mr-1" /> In Maintenance
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">{stat.inMaintenance}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 text-indigo-600">
                Utilization Rate
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">{stat.utilizationRate}%</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
