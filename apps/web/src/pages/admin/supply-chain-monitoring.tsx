import React, { useEffect } from "react";
import { useSupplyChainStore } from "../../stores/supplyChainStore";

export default function SupplyChainMonitoring() {
  const { transfers, fetchTransfers, isLoading } = useSupplyChainStore();

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
        Global Supply-Chain Monitoring
      </h1>

      {isLoading ? (
        <p className="text-slate-400">Loading supply chain events...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-200">Active Warehouse Transfers</h2>
          <div className="space-y-4">
            {transfers.map((tr: any) => (
              <div key={tr.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-indigo-400 font-bold">{tr.transferNumber}</span>
                  <span className="px-3 py-1 bg-indigo-900/30 text-indigo-400 text-xs rounded-full border border-indigo-800/50 font-bold uppercase tracking-wider">
                    {tr.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <span>{tr.sourceWarehouseId}</span>
                  <span className="text-slate-500">→</span>
                  <span>{tr.targetWarehouseId}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
