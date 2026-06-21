import { useEffect } from "react";
import { useEnvironmentStore } from "../../stores/environmentStore";

export default function EnvironmentsDashboard() {
  const { configs, fetchEnvironments } = useEnvironmentStore();

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Environment Configuration</h1>
            <p className="text-gray-400 mt-2">
              Manage secrets, feature flags, and environment variables
            </p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            + Add Variable
          </button>
        </header>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700">
                <th className="p-4 font-semibold text-gray-300">Environment</th>
                <th className="p-4 font-semibold text-gray-300">Key</th>
                <th className="p-4 font-semibold text-gray-300">Value</th>
                <th className="p-4 font-semibold text-gray-300">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {configs.map((conf) => (
                <tr key={conf.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {conf.environment}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-blue-300">{conf.key}</span>
                  </td>
                  <td className="p-4">
                    {conf.isSecret ? (
                      <span className="text-gray-500 tracking-[0.2em] font-mono">********</span>
                    ) : (
                      <span className="text-gray-300 font-mono">{conf.value}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {conf.isSecret ? (
                      <span className="text-red-400 text-xs font-medium flex items-center gap-1">
                        🔒 Secret
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium">Plain Text</span>
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
