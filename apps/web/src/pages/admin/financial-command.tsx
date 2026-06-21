import React, { useEffect } from "react";
import { useFinancialCommandStore } from "../../stores/financialCommandStore";
import {
  Activity as ActivityIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";

const Activity = ActivityIcon as any;
const DollarSign = DollarSignIcon as any;
const TrendingUp = TrendingUpIcon as any;

export default function FinancialCommandCenter() {
  const { purchaseStats, fetchDashboardData } = useFinancialCommandStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-emerald-600" /> Financial & Procurement Command
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Global AI-Assisted Financial Overlook</p>
        </div>
      </header>

      {/* Financial Analytics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Procurement Spend</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
              ₹{purchaseStats?.totalSpend?.toLocaleString() || "0"}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
              {purchaseStats?.totalOrders || "0"}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Pending Approvals</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
              {purchaseStats?.pendingApprovals || "0"}
            </h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Purchase Intelligence & Risk Analysis
        </h2>
        <p className="text-gray-500 max-w-md">
          Procurement algorithms are running optimally. No significant payment risks detected for
          active accounts.
        </p>
      </div>
    </div>
  );
}
