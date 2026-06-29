import React, { useEffect } from "react";
import { useVendorDiscoveryStore } from "../../stores/vendorDiscoveryStore";
import { Search as SearchIcon, MapPin as MapPinIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const Search = SearchIcon as any;
const MapPin = MapPinIcon as any;

export default function SupplierDiscoveryCenter() {
  const { insights, fetchInsights, isLoading } = useVendorDiscoveryStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchInsights(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Search className="w-8 h-8 mr-3 text-pink-600" /> Supplier Discovery
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Regional Matching & Demand Insights</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-pink-500" />
          <h2 className="text-lg font-bold text-gray-900">Regional Supply/Demand Hotspots</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Scanning regions...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Demand Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Supply Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {insights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {insight.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {insight.productCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[60px]">
                          <div
                            className="h-2.5 rounded-full bg-red-500"
                            style={{ width: `${insight.demandScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">
                          {insight.demandScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[60px]">
                          <div
                            className="h-2.5 rounded-full bg-green-500"
                            style={{ width: `${insight.supplyScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">
                          {insight.supplyScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${insight.trend === "RISING" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {insight.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
