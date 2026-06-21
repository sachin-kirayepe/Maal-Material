import React, { useEffect } from "react";
import { useProcurementStore } from "../../stores/procurementStore";

export default function ProcurementDashboard() {
  const { requisitions, fetchRequisitions, isLoading } = useProcurementStore();

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
        Enterprise Procurement Control Center
      </h1>

      {isLoading ? (
        <p className="text-slate-400">Loading procurement workflows...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-200">Active Purchase Requisitions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3 px-4 uppercase text-xs tracking-wider">PR Number</th>
                  <th className="py-3 px-4 uppercase text-xs tracking-wider">Department</th>
                  <th className="py-3 px-4 uppercase text-xs tracking-wider">Priority</th>
                  <th className="py-3 px-4 uppercase text-xs tracking-wider">Est. Cost</th>
                  <th className="py-3 px-4 uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {requisitions.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-emerald-400">{pr.prNumber}</td>
                    <td className="py-4 px-4">{pr.department}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${pr.priority === "HIGH" ? "bg-red-900/50 text-red-400" : "bg-slate-700 text-slate-300"}`}
                      >
                        {pr.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">${pr.estimatedCost?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
