import { useEffect } from "react";
import { usePlatformStore } from "../../stores/platformStore";

export default function PlatformExtensions() {
  const { services, extensions, fetchPlatform } = usePlatformStore();

  useEffect(() => {
    fetchPlatform();
  }, [fetchPlatform]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Platform Evolution & Extensions</h1>
        <p className="text-gray-600 mb-8">
          Manage bounded context microservices and external developer SDK plugins.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Internal Microservices</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {services.map((svc) => (
                  <li key={svc.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-indigo-600">{svc.serviceName}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {svc.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Version: {svc.version}</p>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Exposed Contracts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {svc.contracts.map((contract: any) => (
                          <span
                            key={contract.id}
                            className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs rounded"
                          >
                            {contract.contractType}: {contract.contractName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Installed Plugins & SDKs</h2>
            <div className="space-y-4">
              {extensions.map((ext) => (
                <div
                  key={ext.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{ext.extensionName}</h3>
                    <p className="text-sm text-gray-500">
                      By: {ext.publisher} | v{ext.version}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {ext.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
