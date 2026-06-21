import React, { useEffect } from "react";
import { useAccountingStore } from "../../stores/accountingStore";

export default function AccountingDashboard() {
  const { chartOfAccounts, ledgers, loading, fetchAccountingData } = useAccountingStore();

  useEffect(() => {
    fetchAccountingData();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enterprise Accounting</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Double-entry bookkeeping & General Ledger management
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
          + New Journal Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Chart of Accounts</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Code</th>
                    <th className="px-4 py-3">Account Name</th>
                    <th className="px-4 py-3 rounded-r-lg">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {chartOfAccounts.map((coa) => (
                    <tr key={coa.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{coa.code}</td>
                      <td className="px-4 py-3 text-gray-600">{coa.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                          {coa.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">General Ledger Balances</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Account No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ledgers.map((ledger) => (
                    <tr key={ledger.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {ledger.accountNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ledger.name}</td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${ledger.balance < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        ${Math.abs(ledger.balance).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
