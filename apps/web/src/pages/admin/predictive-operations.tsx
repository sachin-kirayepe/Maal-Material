import React, { useEffect } from "react";
import { useContractorAnalyticsStore } from "../../stores/contractorAnalyticsStore";
import { useTenantId } from "@/hooks/useTenantId";
import {
  LineChart as LineChartIcon,
  Briefcase as BriefcaseIcon,
  Activity as ActivityIcon,
} from "lucide-react";
const LineChart = LineChartIcon as any;
const Briefcase = BriefcaseIcon as any;
const Activity = ActivityIcon as any;

export default function PredictiveOperationsCenter() {
  const { contractors, workflows, fetchContractors, fetchWorkflows, isLoading } =
    useContractorAnalyticsStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchContractors(tenantId);
    fetchWorkflows(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <LineChart className="w-8 h-8 mr-3 text-blue-600" /> Predictive Operations Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Contractor Analytics & Operational Workflows
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Contractor Churn Risk</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading metrics...</div>
            ) : (
              <div className="space-y-4">
                {contractors.length === 0 ? (
                  <p className="text-gray-500">No contractor data available.</p>
                ) : (
                  contractors.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900">{c.contractorId}</h4>
                        <p className="text-sm text-gray-500 font-medium">
                          Buying Pattern: {c.buyingPattern}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-red-600">
                          {(c.churnRisk * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Churn Risk
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">AI Prepared Workflows</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading workflows...</div>
            ) : (
              <div className="space-y-4">
                {workflows.length === 0 ? (
                  <p className="text-gray-500">No active AI workflows.</p>
                ) : (
                  workflows.map((w) => (
                    <div key={w.id} className="p-4 border border-gray-100 rounded-lg bg-blue-50/50">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-gray-900">{w.workflowType}</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          {w.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{w.contextData}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
