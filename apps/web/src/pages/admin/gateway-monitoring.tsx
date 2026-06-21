import { useEffect } from "react";
import { useGatewayStore } from "../../stores/gatewayStore";

export default function GatewayMonitoring() {
  const { policies, fetchPolicies, togglePolicy } = useGatewayStore();

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">API Gateway Monitoring</h1>
        <p className="text-gray-600 mb-8">
          Manage rate limits, routing rules, and authentication policies.
        </p>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forward To (Service)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id} className={!policy.isActive ? "opacity-50 bg-gray-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {policy.routeMatch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                    {policy.forwardTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.rateLimitRate} req / {policy.rateLimitWindow}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${policy.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {policy.isActive ? "ACTIVE" : "DISABLED"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => togglePolicy(policy.id, !policy.isActive)}
                      className={`px-3 py-1 rounded text-white ${policy.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {policy.isActive ? "Disable" : "Enable"}
                    </button>
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
