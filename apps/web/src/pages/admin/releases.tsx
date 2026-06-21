import { useEffect } from "react";
import { useReleaseStore } from "../../stores/releaseStore";

export default function ReleasesDashboard() {
  const { releases, fetchReleases, publishRelease } = useReleaseStore();

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Release Orchestration</h1>
          <p className="text-gray-400 mt-2">Manage semantic versions and release candidates</p>
        </header>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700">
                <th className="p-4 font-semibold text-gray-300">Version</th>
                <th className="p-4 font-semibold text-gray-300">Notes</th>
                <th className="p-4 font-semibold text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-300">Created At</th>
                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {releases.map((release) => (
                <tr key={release.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-lg text-blue-400">
                      {release.version}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 max-w-md truncate">{release.notes}</p>
                  </td>
                  <td className="p-4">
                    {release.isPublished ? (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                        PUBLISHED
                      </span>
                    ) : (
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                        CANDIDATE
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(release.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {!release.isPublished && (
                      <button
                        onClick={() => publishRelease(release.id)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Publish Release
                      </button>
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
