import React, { useEffect } from "react";
import { useSecurityStore } from "../../stores/securityStore";

export default function SecurityDashboard() {
  const { events, isLoading, error, fetchEvents, blockIp } = useSecurityStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (isLoading) return <div className="p-8 text-white">Loading Security Data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
        Enterprise Security Center
      </h1>

      <div className="bg-[#111] p-6 rounded-xl border border-red-500/20 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-red-400">Security Events & Threats</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{evt.eventType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        evt.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : evt.severity === "WARNING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">{evt.ipAddress || "N/A"}</td>
                  <td className="px-6 py-4">{new Date(evt.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {evt.ipAddress && (
                      <button
                        onClick={() => blockIp(evt.ipAddress!)}
                        className="text-red-500 hover:text-red-400 font-medium"
                      >
                        Block IP
                      </button>
                    )}
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
