import React, { useEffect } from "react";
import { useDisputeStore } from "../../stores/disputeStore";
import { Gavel as GavelIcon, MessageSquare as MessageSquareIcon } from "lucide-react";
const Gavel = GavelIcon as any;
const MessageSquare = MessageSquareIcon as any;

export default function DisputeManagementCenter() {
  const { disputes: cases, fetchDisputes: fetchCases, updateCaseStatus, isLoading } = useDisputeStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchCases(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Gavel className="w-8 h-8 mr-3 text-indigo-600" /> Dispute Management Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Resolve Conflicts & Delivery Issues</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Disputes</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading cases...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ref ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Raised By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Against
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {c.referenceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {c.disputeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.raisedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.againstEntityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${c.status === "OPEN" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {c.status === "OPEN" && (
                        <button
                          onClick={() =>
                            updateCaseStatus(tenantId, c.id, "SETTLED", "Refund issued to buyer")
                          }
                          className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded hover:bg-indigo-100"
                        >
                          Settle Case
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
