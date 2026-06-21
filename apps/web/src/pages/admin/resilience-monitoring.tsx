import React, { useEffect } from "react";
import { useResilienceStore } from "../../stores/resilienceStore";

export default function ResilienceMonitoring() {
  const { failures, retries, isLoading, error, fetchFailures, fetchRetries, resolveFailure } =
    useResilienceStore();

  useEffect(() => {
    fetchFailures();
    fetchRetries();
  }, [fetchFailures, fetchRetries]);

  if (isLoading) return <div className="p-8 text-white">Loading Resilience Data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
        Resilience & Fault Tolerance
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Failures Column */}
        <div className="bg-[#111] p-6 rounded-xl border border-orange-500/20">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">System Failures</h2>
          <div className="space-y-4">
            {failures.length === 0 ? (
              <p className="text-gray-500">No failures recorded.</p>
            ) : (
              failures.map((f) => (
                <div key={f.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-red-400">
                      {f.serviceName} - {f.errorType}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${f.isResolved ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {f.isResolved ? "RESOLVED" : "ACTIVE"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{f.message}</p>
                  {!f.isResolved && (
                    <button
                      onClick={() => resolveFailure(f.id)}
                      className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded hover:bg-orange-500/30 transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Retries Column */}
        <div className="bg-[#111] p-6 rounded-xl border border-yellow-500/20">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Dead-Letter & Retry Queues</h2>
          <div className="space-y-4">
            {retries.length === 0 ? (
              <p className="text-gray-500">Queue is empty.</p>
            ) : (
              retries.map((r) => (
                <div key={r.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-yellow-400">{r.jobType}</span>
                    <span className="text-xs text-gray-500">{r.status}</span>
                  </div>
                  <div className="text-sm text-gray-400 flex justify-between">
                    <span>
                      Attempts: {r.attempts}/{r.maxAttempts}
                    </span>
                    <span>Next Retry: {new Date(r.nextRetryAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
