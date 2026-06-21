import React, { useEffect } from "react";
import { useRfqExchangeStore } from "../../stores/rfqExchangeStore";
import { FileText as FileTextIcon, Handshake as HandshakeIcon } from "lucide-react";
const FileText = FileTextIcon as any;
const Handshake = HandshakeIcon as any;

export default function RFQManagementCenter() {
  const { rfqs, fetchRfqs, updateRfqStatus, isLoading } = useRfqExchangeStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchRfqs(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <FileText className="w-8 h-8 mr-3 text-purple-600" /> RFQ Exchange Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">B2B Bidding & Quotation Negotiation</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <Handshake className="w-5 h-5 mr-2 text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Requests for Quotation</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading RFQs...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Bids
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
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {rfq.buyerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {rfq.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rfq.requirements}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-indigo-600">
                      {rfq.bidsReceived}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${rfq.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {rfq.status === "OPEN" && (
                        <button
                          onClick={() => updateRfqStatus(rfq.id, "NEGOTIATING")}
                          className="text-xs bg-purple-50 text-purple-600 font-bold px-3 py-1 rounded hover:bg-purple-100"
                        >
                          Start Negotiation
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
