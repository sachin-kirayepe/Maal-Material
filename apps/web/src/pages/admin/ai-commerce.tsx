import React, { useEffect } from "react";
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { useRecommendationsStore } from "../../stores/recommendationsStore";
import {
  Bot as BotIcon,
  AlertTriangle as AlertTriangleIcon,
  TrendingUp as TrendingUpIcon,
  Cpu as CpuIcon,
  Database as DatabaseIcon,
} from "lucide-react";
import { ledgerService } from "../../core/domain/finance/ledger-service";

const Bot = BotIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const TrendingUp = TrendingUpIcon as any;
const Cpu = CpuIcon as any;
const Database = DatabaseIcon as any;

export default function AICommerceDashboard() {
  const { summary, fetchSummary, isLoading: summaryLoading } = useIntelligenceStore();
  const { recommendations, fetchRecommendations, actionRecommendation } = useRecommendationsStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchSummary(tenantId);
    fetchRecommendations(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Cpu className="w-8 h-8 mr-3 text-blue-600" /> AI Commerce Brain
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Enterprise Intelligence Orchestration Layer
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-bold border border-blue-200">
          <Bot className="w-5 h-5" />
          <span>System {summary?.systemStatus || "INITIALIZING"}</span>
        </div>
      </header>

      {summaryLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Pending Recommendations
                </p>
                <h3 className="text-4xl font-black text-gray-900 mt-2">
                  {summary?.pendingRecommendations || 0}
                </h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 border-l-4 border-l-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  High Risk Customers
                </p>
                <h3 className="text-4xl font-black text-gray-900 mt-2">
                  {summary?.highRiskCustomers || 0}
                </h3>
              </div>
              <TrendingUp className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Dead Stock Risks
                </p>
                <h3 className="text-4xl font-black text-gray-900 mt-2">
                  {summary?.deadStockRisks || 0}
                </h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-blue-600" /> Operational AI Recommendations
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recommendations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 font-medium">
              No actionable intelligence available at this moment.
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {rec.module}
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Impact: {rec.impactScore}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => actionRecommendation(tenantId, rec.id, "ACCEPTED", "sys-admin")}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
                  >
                    Execute
                  </button>
                  <button
                    onClick={() => actionRecommendation(tenantId, rec.id, "DISMISSED", "sys-admin")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Immutable Ledger Feed */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden text-emerald-500 font-mono">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center">
            <Database className="w-5 h-5 mr-2 text-emerald-400" /> Immutable Predictive Ledger Feed
          </h2>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs">LIVE SYNC</span>
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tx ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Value (USD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Crypto Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ledgerService.getTransactions().length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-600">
                    No autonomous transactions recorded in current session.
                  </td>
                </tr>
              ) : (
                ledgerService.getTransactions().map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-emerald-300">{tx.id}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-400">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-xs">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right font-bold text-emerald-200">
                      $
                      {tx.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className="px-6 py-3 whitespace-nowrap text-slate-500 text-xs truncate max-w-[150px]"
                      title={tx.cryptoHash}
                    >
                      {tx.cryptoHash}
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
