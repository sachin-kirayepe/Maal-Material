import { useEffect } from "react";
import { useInfrastructureStore } from "../../stores/infrastructureStore";

export default function InfrastructureDashboard() {
  const { nodes, regions, fetchInfrastructure } = useInfrastructureStore();

  useEffect(() => {
    fetchInfrastructure();
  }, [fetchInfrastructure]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Global Infrastructure Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Active Regions
            </h2>
            <div className="space-y-4">
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {region.regionName} ({region.regionCode})
                    </h3>
                    <p className="text-sm text-gray-500">Database: {region.primaryDatabase}</p>
                    {region.dataResidency && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Strict Data Residency
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${region.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {region.isActive ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Compute Nodes
            </h2>
            <div className="space-y-4">
              {nodes.map((node) => (
                <div key={node.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{node.nodeId}</h4>
                      <p className="text-xs text-gray-500">
                        Type: {node.nodeType} | Region: {node.region}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CPU Usage</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${node.cpuUsage || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right mt-1">{node.cpuUsage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Memory Usage</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${node.memoryUsage || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right mt-1">{node.memoryUsage}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
