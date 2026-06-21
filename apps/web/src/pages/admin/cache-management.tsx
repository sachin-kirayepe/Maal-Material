import { useEffect } from "react";
import { useCacheStore } from "../../stores/cacheStore";

export default function CacheManagement() {
  const { entries, fetchEntries, invalidateKey } = useCacheStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Distributed Cache Management</h1>
        <p className="text-gray-600 mb-8">
          View cache entries and manage global invalidation strategies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white p-6 rounded-lg shadow-sm border ${entry.invalidated ? "border-red-300 opacity-75 bg-red-50" : "border-gray-200"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-mono text-sm text-indigo-700 break-all">{entry.cacheKey}</h3>
                {entry.invalidated ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                    INVALIDATED
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    HIT
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Value Preview:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs text-gray-800 overflow-x-auto h-20">
                  {entry.cacheValue}
                </pre>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">TTL: {entry.ttlSeconds}s</span>
                {!entry.invalidated && (
                  <button
                    onClick={() => invalidateKey(entry.cacheKey)}
                    className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded transition-colors"
                  >
                    Force Invalidate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
