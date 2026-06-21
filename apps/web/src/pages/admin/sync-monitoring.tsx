import React, { useEffect } from "react";
import { useSyncStore } from "../../stores/syncStore";

export default function SyncMonitoring() {
  const { queues, conflicts, isLoading, error, fetchQueues, fetchConflicts, resolveConflict } =
    useSyncStore() as any;

  useEffect(() => {
    fetchQueues();
    fetchConflicts();
  }, [fetchQueues, fetchConflicts]);

  if (isLoading) return <div className="p-8 text-white">Loading Sync Data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
        Offline Sync Monitoring
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#111] p-6 rounded-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">
            Offline Sync Queue (Pending & Processed)
          </h2>
          <div className="space-y-4">
            {queues.length === 0 ? (
              <p className="text-gray-500">No sync operations.</p>
            ) : (
              queues.map((q: any) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#1a1a1a] rounded border border-gray-800 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-white">
                      {q.operationType}{" "}
                      <span className="text-gray-500 text-sm">on {q.entityName}</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Server Recv: {new Date(q.serverTime).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      q.status === "SUCCESS"
                        ? "bg-green-500/20 text-green-400"
                        : q.status === "CONFLICT"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-red-500/20">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Sync Conflicts Requiring Resolution
          </h2>
          <div className="space-y-4">
            {conflicts.length === 0 ? (
              <p className="text-gray-500">No active conflicts.</p>
            ) : (
              conflicts.map((c: any) => (
                <div key={c.id} className="p-4 bg-[#1a1a1a] rounded border border-red-900/30">
                  <h4 className="font-semibold text-red-300 mb-2">
                    Conflict on {c.entityName} ({c.entityId})
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                    <div className="p-2 bg-black/50 border border-gray-800 rounded">
                      <span className="text-gray-500 block mb-1">Server (Live):</span>
                      <pre className="text-blue-400">
                        {JSON.stringify(JSON.parse(c.serverPayload), null, 2)}
                      </pre>
                    </div>
                    <div className="p-2 bg-black/50 border border-gray-800 rounded">
                      <span className="text-gray-500 block mb-1">Client (Offline Update):</span>
                      <pre className="text-yellow-400">
                        {JSON.stringify(JSON.parse(c.clientPayload), null, 2)}
                      </pre>
                    </div>
                  </div>
                  {c.status === "UNRESOLVED" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => resolveConflict(c.id, "SERVER_WINS")}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30"
                      >
                        Keep Server (Reject)
                      </button>
                      <button
                        onClick={() => resolveConflict(c.id, "CLIENT_WINS")}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded hover:bg-yellow-500/30"
                      >
                        Force Client (Overwrite)
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-green-500">
                      Resolved via {c.resolutionMethod}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
