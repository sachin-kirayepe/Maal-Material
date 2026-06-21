import { useEffect } from "react";
import { useEnvironmentStore } from "../../stores/environmentStore";

export default function CICDPipeline() {
  const { pipelines, fetchEnvironments } = useEnvironmentStore();

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">CI/CD Pipeline Monitor</h1>
          <p className="text-gray-400 mt-2">Track GitHub Actions and automated build workflows</p>
        </header>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700">
                <th className="p-4 font-semibold text-gray-300">Pipeline</th>
                <th className="p-4 font-semibold text-gray-300">Branch</th>
                <th className="p-4 font-semibold text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-300">Duration</th>
                <th className="p-4 font-semibold text-gray-300">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pipelines.map((pipe) => (
                <tr key={pipe.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{pipe.pipelineName}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono">
                      {pipe.branch}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-2 ${
                        pipe.status === "SUCCESS"
                          ? "text-green-400"
                          : pipe.status === "RUNNING"
                            ? "text-blue-400 animate-pulse"
                            : "text-red-400"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          pipe.status === "SUCCESS"
                            ? "bg-green-400"
                            : pipe.status === "RUNNING"
                              ? "bg-blue-400"
                              : "bg-red-400"
                        }`}
                      />
                      {pipe.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {pipe.durationMs ? `${(pipe.durationMs / 1000).toFixed(1)}s` : "-"}
                  </td>
                  <td className="p-4 text-gray-400">{new Date(pipe.startedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
