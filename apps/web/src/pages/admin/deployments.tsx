import { useEffect } from "react";
import { useDeploymentStore } from "../../stores/deploymentStore";

export default function DeploymentsDashboard() {
  const { deployments, fetchDeployments, triggerDeployment, rollbackDeployment } =
    useDeploymentStore();

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Deployment Orchestration</h1>
            <p className="text-gray-400 mt-2">Monitor production rollouts and deployment events</p>
          </div>
          <button
            onClick={() => triggerDeployment("latest", "production")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Deploy to Production
          </button>
        </header>

        <div className="grid gap-6">
          {deployments.map((dep) => (
            <div key={dep.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-semibold text-white">{dep.version}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dep.status === "SUCCESS"
                          ? "bg-green-500/20 text-green-400"
                          : dep.status === "DEPLOYING"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {dep.status}
                    </span>
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                      {dep.environment.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Initiated by {dep.initiatorId} at {new Date(dep.startedAt).toLocaleString()}
                  </p>
                </div>
                {dep.status === "SUCCESS" && (
                  <button
                    onClick={() => rollbackDeployment(dep.id)}
                    className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded transition-colors text-sm font-medium"
                  >
                    Rollback
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Deployment Events
                </h4>
                {dep.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 text-sm bg-gray-900/50 p-3 rounded"
                  >
                    <span className="text-gray-500 w-24">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-mono text-blue-400 w-24">{event.state}</span>
                    <span className="text-gray-300">{event.message}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
