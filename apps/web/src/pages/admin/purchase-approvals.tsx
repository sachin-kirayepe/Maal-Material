import React, { useEffect } from "react";
import { useProcurementStore } from "../../stores/procurementStore";

export default function PurchaseApprovals() {
  const { requisitions, fetchRequisitions, isLoading } = useProcurementStore();

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
        Enterprise Approval Orchestration
      </h1>

      {isLoading ? (
        <p className="text-slate-400">Loading approvals...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-200">Pending Purchase Requisitions</h2>
          <div className="space-y-4">
            {requisitions
              .filter((pr) => pr.status === "PENDING_APPROVAL")
              .map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400 font-mono">{pr.prNumber}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {pr.department} - Est: ${pr.estimatedCost?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-bold transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            {requisitions.filter((pr) => pr.status === "PENDING_APPROVAL").length === 0 && (
              <p className="text-slate-400 italic">No pending approvals.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
