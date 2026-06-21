import React, { useEffect } from "react";
import { useMobileStore } from "../../stores/mobileStore";

export default function MobileDashboard() {
  const { sessions, isLoading, error, fetchSessions } = useMobileStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (isLoading) return <div className="p-8 text-white">Loading Mobile Overview...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Enterprise Mobile Dashboard
      </h1>

      <div className="bg-[#111] p-6 rounded-xl border border-cyan-500/20 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-400">Active Mobile Workforce</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Worker</th>
                <th className="px-6 py-3">Device / OS</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {session.user?.firstName || "Unknown"} {session.user?.lastName || ""}
                  </td>
                  <td className="px-6 py-4">
                    {session.device?.name} ({session.device?.os})
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(session.lastActiveAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
