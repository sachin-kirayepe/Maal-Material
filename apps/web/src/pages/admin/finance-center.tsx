import React, { useEffect } from "react";
import { useFinanceStore } from "../../stores/financeStore";

export default function FinanceCenter() {
  const { profitability, cashFlow, loading, fetchFinanceIntelligence } = useFinanceStore();

  useEffect(() => {
    fetchFinanceIntelligence();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Finance Intelligence Center
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Real-time profitability, margins, and operational financial analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
            Net Profitability
          </p>
          {loading ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded mt-4 w-1/2"></div>
          ) : (
            <h2
              className={`text-4xl font-bold mt-4 ${profitability?.netProfit < 0 ? "text-red-600" : "text-emerald-600"}`}
            >
              ${Math.abs(profitability?.netProfit || 0).toLocaleString()}
            </h2>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Profit Margin</p>
          {loading ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded mt-4 w-1/3"></div>
          ) : (
            <h2 className="text-4xl font-bold mt-4 text-gray-900">
              {profitability?.profitMargin?.toFixed(2) || 0}%
            </h2>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
            Cash Equivalents
          </p>
          {loading ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded mt-4 w-1/2"></div>
          ) : (
            <h2 className="text-4xl font-bold mt-4 text-blue-600">
              ${(cashFlow?.cashEquivalent || 0).toLocaleString()}
            </h2>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h2>
        <p className="text-gray-600 text-sm">
          Advanced charting and historical trends would be rendered here.
        </p>
        <div className="mt-8 h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
          <span className="text-gray-400 font-medium">Financial Intelligence Chart Engine</span>
        </div>
      </div>
    </div>
  );
}
