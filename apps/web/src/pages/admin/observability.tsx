export default function ObservabilityCenter() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Production Observability</h1>
          <p className="text-gray-400 mt-2">
            Prometheus, Grafana, and Distributed Tracing aggregations
          </p>
        </header>

        <div className="flex-grow flex items-center justify-center bg-gray-800 border border-gray-700 rounded-xl border-dashed">
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Grafana Dashboards Linking Ready</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Prometheus scrape endpoints are exposed via /api/v1/monitoring. Configure your
              external Grafana instance to consume these traces.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Connect Prometheus
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                View Raw Traces
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
