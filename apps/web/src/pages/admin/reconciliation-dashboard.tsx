import React, { useEffect } from "react";
import { useReconciliationStore } from "../../stores/reconciliationStore";

export default function ReconciliationDashboard() {
  const { records, loading, fetchReconciliations } = useReconciliationStore();

  useEffect(() => {
    fetchReconciliations();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Enterprise Reconciliation
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Automated bank and ledger reconciliation workflows
          </p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Run Auto-Reconciliation
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reconciliation Logs</h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Date Range</th>
                  <th className="px-4 py-3">Bank Account</th>
                  <th className="px-4 py-3 text-right">System Balance</th>
                  <th className="px-4 py-3 text-right">Statement Balance</th>
                  <th className="px-4 py-3 text-right">Difference</th>
                  <th className="px-4 py-3 rounded-r-lg text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(record.periodStart).toLocaleDateString()} -{" "}
                      {new Date(record.periodEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {record.bankAccount?.bankName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${record.systemBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${record.statementBalance.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${record.difference !== 0 ? "text-red-600" : "text-gray-900"}`}
                    >
                      ${record.difference.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          record.status === "MATCHED"
                            ? "bg-green-100 text-green-800"
                            : record.status === "DISCREPANCY"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        No reconciliation records available.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
