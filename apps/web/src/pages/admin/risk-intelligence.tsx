import React, { useEffect } from "react";
import { useRiskAnalysisStore } from "../../stores/riskAnalysisStore";
import {
  ShieldAlert as ShieldAlertIcon,
  Users as UsersIcon,
  Truck as TruckIcon,
} from "lucide-react";
const ShieldAlert = ShieldAlertIcon as any;
const Users = UsersIcon as any;
const Truck = TruckIcon as any;

export default function RiskIntelligenceCenter() {
  const {
    customerRisks,
    vendorIntelligence,
    fetchCustomerRisks,
    fetchVendorIntelligence,
    isLoading,
  } = useRiskAnalysisStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchCustomerRisks(tenantId);
    fetchVendorIntelligence(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-600" /> Risk Intelligence Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Customer Credit & Vendor Reliability Scoring
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Customer Udhari & Credit Risk</h2>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Credit Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Delay Prob
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {risk.customerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {risk.creditScore} / 1000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                        {(risk.delayProbability * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${risk.recoveryPriority === "HIGH" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {risk.recoveryPriority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Vendor Reliability Scans</h2>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Vendor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Reliability Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Avg Delay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Dispute Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendorIntelligence.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {v.vendorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {v.reliabilityScore.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {v.deliveryAvgDays.toFixed(1)} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {(v.disputeRate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
