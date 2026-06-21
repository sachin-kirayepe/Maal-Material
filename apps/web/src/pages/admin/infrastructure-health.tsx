import { useEffect } from "react";
import { useMonitoringStore } from "../../stores/monitoringStore";

export default function InfrastructureHealth() {
  const { nodes, metrics, fetchMonitoring } = useMonitoringStore();

  useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Cluster Health & Metrics</h1>
          <p className="text-gray-400 mt-2">Kubernetes worker node telemetry and fleet status</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-white">{node.name}</h3>
                <span
                  className={`w-3 h-3 rounded-full ${node.status === "READY" ? "bg-green-500" : "bg-red-500"} shadow-lg`}
                />
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-mono text-gray-200">{node.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Region:</span>
                  <span className="font-mono text-gray-200">{node.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="font-mono text-gray-200">{node.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Telemetry (CPU %)</h3>
          <div className="h-64 flex items-end gap-2 border-b border-l border-gray-700 p-4">
            {metrics.slice(0, 30).map((metric) => (
              <div
                key={metric.id}
                className="relative flex-1 group flex flex-col justify-end h-full"
              >
                <div
                  className="w-full bg-blue-500/50 hover:bg-blue-400 transition-colors rounded-t-sm"
                  style={{ height: `${Math.min(100, Math.max(5, metric.value))}%` }}
                />
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                  {metric.value.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
