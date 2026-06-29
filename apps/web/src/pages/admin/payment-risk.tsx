import React, { useEffect } from "react";
import { useRiskAssessmentStore } from "../../stores/riskAssessmentStore";
import { WalletCards as WalletCardsIcon, ShieldAlert as ShieldAlertIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const WalletCards = WalletCardsIcon as any;
const ShieldAlert = ShieldAlertIcon as any;

export default function PaymentRiskDashboard() {
  const { assessments, fetchAssessments, isLoading } = useRiskAssessmentStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchAssessments(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <WalletCards className="w-8 h-8 mr-3 text-orange-600" /> Payment Risk Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Bad Debt Prediction & Delay Analysis</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">Entity Risk Assessments</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Evaluating risks...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entity ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Risk Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Analysis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {a.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {a.riskType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div
                            className={`h-2.5 rounded-full ${a.riskScore > 75 ? "bg-red-600" : a.riskScore > 50 ? "bg-orange-500" : "bg-green-500"}`}
                            style={{ width: `${a.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{a.riskScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.analysisDetails}</td>
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
