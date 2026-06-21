import React, { useEffect } from "react";
import { useTreasuryStore } from "../../stores/treasuryStore";

export default function TreasuryManagement() {
  const { bankAccounts, treasuryBalance, loading, fetchTreasuryData } = useTreasuryStore();

  useEffect(() => {
    fetchTreasuryData();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Treasury Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Bank accounts, payouts, and cash flow orchestration
          </p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors">
          + Link Bank Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Linked Bank Accounts</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                    <p className="text-sm text-gray-500">
                      {account.accountType} •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${account.currentBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{account.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between">
          <div>
            <p className="text-indigo-200 font-medium uppercase tracking-wide text-sm">
              Total Treasury Balance
            </p>
            {loading ? (
              <div className="h-12 bg-indigo-800/50 animate-pulse rounded mt-4 w-1/2"></div>
            ) : (
              <h2 className="text-5xl font-bold mt-4 tracking-tight">
                ${treasuryBalance?.totalBalance.toLocaleString() || "0"}
              </h2>
            )}
          </div>
          <div className="mt-12 flex space-x-4">
            <button className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm transition-colors font-medium">
              Transfer Funds
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm transition-colors font-medium">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
