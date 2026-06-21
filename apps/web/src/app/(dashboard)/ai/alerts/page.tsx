"use client";

import React, { useEffect } from "react";
import { useInsightsStore } from "../../../../stores/insightsStore";

export default function Alerts() {
  const { operationalAlerts, fetchOperationalAlerts, resolveAlert, isLoading } = useInsightsStore();

  useEffect(() => {
    fetchOperationalAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Real-time Operational Alerts</h1>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        {isLoading ? (
          <p>Loading alerts...</p>
        ) : (
          <div className="space-y-4">
            {operationalAlerts.length > 0 ? (
              operationalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border border-gray-200 rounded-lg flex items-start justify-between bg-red-50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-red-700">{alert.type}</span>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-200 text-red-800 rounded">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Source: {alert.source} | Detected:{" "}
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                  >
                    Mark Resolved
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active operational alerts.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
