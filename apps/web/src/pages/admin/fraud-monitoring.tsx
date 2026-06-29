import React, { useEffect } from "react";
import { useFraudStore } from "../../stores/fraudStore";
import { AlertTriangle as AlertTriangleIcon, AlertOctagon as AlertOctagonIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const AlertTriangle = AlertTriangleIcon as any;
const AlertOctagon = AlertOctagonIcon as any;

export default function FraudMonitoringCenter() {
  const { signals, fetchSignals, resolveSignal, isLoading } = useFraudStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchSignals(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <AlertOctagon className="w-8 h-8 mr-3 text-red-600" /> Fraud Monitoring Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Live Anomaly & Suspicious Activity Detection
          </p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Fraud Signals</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Scanning for anomalies...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entity ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Signal Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Description
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
                {signals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {signal.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {signal.signalType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${signal.severity === "CRITICAL" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {signal.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{signal.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-800">
                        {signal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {signal.status === "OPEN" && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => resolveSignal(tenantId, signal.id, "RESOLVED")}
                            className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded hover:bg-blue-100"
                          >
                            Confirm Fraud
                          </button>
                          <button
                            onClick={() => resolveSignal(tenantId, signal.id, "FALSE_POSITIVE")}
                            className="text-xs bg-gray-50 text-gray-500 font-bold px-3 py-1 rounded hover:bg-gray-100"
                          >
                            Dismiss
                          </button>
                        </div>
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
