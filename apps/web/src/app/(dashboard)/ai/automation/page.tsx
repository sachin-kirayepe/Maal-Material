"use client";

import React, { useEffect } from "react";
import { useAutomationStore } from "../../../../stores/automationStore";

export default function Automation() {
  const { workflows, fetchWorkflows, toggleWorkflow, isLoading } = useAutomationStore();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Intelligent Workflows</h1>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Configured Automations</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded shadow text-sm font-semibold hover:bg-blue-700">
            + New Workflow
          </button>
        </div>

        {isLoading ? (
          <p>Loading workflows...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.length > 0 ? (
                  workflows.map((wf) => (
                    <tr key={wf.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{wf.name}</div>
                        <div className="text-sm text-gray-500">{wf.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {wf.triggerType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wf.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {wf.isActive ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleWorkflow(wf.id, !wf.isActive)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {wf.isActive ? "Pause" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No workflows configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
