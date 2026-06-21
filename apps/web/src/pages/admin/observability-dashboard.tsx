import React, { useEffect } from "react";
import { useObservabilityStore } from "../../stores/observabilityStore";

export default function ObservabilityDashboard() {
  const { metrics, isLoading, error, fetchMetrics } = useObservabilityStore();

  useEffect(() => {
    fetchMetrics();
    // const interval = setInterval(fetchMetrics, 30000); // refresh every 30s
    // return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (isLoading && metrics.length === 0)
    return <div className="p-8 text-white">Loading Metrics...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
        System Observability
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Simple mock summary cards based on the first few metrics */}
        <div className="bg-[#111] p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">System Health</h3>
          <p className="text-3xl font-bold text-green-400">99.9%</p>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-indigo-500/20">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Avg Latency</h3>
          <p className="text-3xl font-bold text-indigo-400">120ms</p>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-pink-500/20">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Nodes</h3>
          <p className="text-3xl font-bold text-pink-400">4 / 4</p>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-xl border border-purple-500/20">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">Recent Metrics Stream</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Metric Name</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr
                  key={metric.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{metric.metricName}</td>
                  <td className="px-6 py-4 font-mono text-purple-400">
                    {metric.metricValue} {metric.unit}
                  </td>
                  <td className="px-6 py-4">{new Date(metric.recordedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
