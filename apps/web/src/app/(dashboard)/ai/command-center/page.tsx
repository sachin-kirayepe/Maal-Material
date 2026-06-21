"use client";

import React, { useEffect } from "react";
import { useAiStore } from "../../../../stores/aiStore";

export default function CommandCenter() {
  const { actionLogs, fetchActionLogs, isLoading } = useAiStore();

  useEffect(() => {
    fetchActionLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI Command Center</h1>
      <p className="text-gray-500">Enterprise Operational Intelligence & Autonomous Actions</p>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Autonomous Actions</h2>
        {isLoading ? (
          <p>Loading logs...</p>
        ) : (
          <div className="space-y-4">
            {actionLogs.length > 0 ? (
              actionLogs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">{log.actionType}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.executedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.description}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded ${log.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {log.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No autonomous actions executed yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
