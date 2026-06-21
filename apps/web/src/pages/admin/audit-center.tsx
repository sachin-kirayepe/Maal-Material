import React, { useEffect } from "react";
import { useAuditStore } from "../../stores/auditStore";

export default function AuditCenter() {
  const { logs, isLoading, error, fetchLogs } = useAuditStore();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (isLoading) return <div className="p-8 text-white">Loading Audit Trails...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
        Enterprise Audit Center
      </h1>

      <div className="bg-[#111] p-6 rounded-xl border border-blue-500/20 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">System Audit Trails</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity Type</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Changes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{log.action}</td>
                  <td className="px-6 py-4">{log.entityType}</td>
                  <td className="px-6 py-4">{log.entityId}</td>
                  <td className="px-6 py-4">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <details className="cursor-pointer">
                      <summary className="text-blue-500 text-xs">View Data</summary>
                      <div className="mt-2 text-xs bg-black p-2 rounded">
                        {log.oldData && (
                          <div>
                            <span className="text-red-400">Old:</span> {log.oldData}
                          </div>
                        )}
                        {log.newData && (
                          <div>
                            <span className="text-green-400">New:</span> {log.newData}
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
