import React, { useEffect } from "react";
import { useSupplyChainStore } from "../../stores/supplyChainStore";
import { Map as MapIcon, Anchor as AnchorIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const Map = MapIcon as any;
const Anchor = AnchorIcon as any;

export default function LogisticsCoordinationCenter() {
  const { logistics, fetchLogistics, assignTransporter, isLoading } = useSupplyChainStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchLogistics(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Anchor className="w-8 h-8 mr-3 text-sky-600" /> Logistics Coordination
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Route Assignment & Fulfillment Tracking</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <Map className="w-5 h-5 mr-2 text-sky-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Shipments</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Routing shipments...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ref ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Transporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logistics.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {route.referenceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {route.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {route.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.transporterId || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${route.status === "PENDING" ? "bg-orange-100 text-orange-800" : "bg-sky-100 text-sky-800"}`}
                      >
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {route.status === "PENDING" && (
                        <button
                          onClick={() => assignTransporter(route.id, "TR-BLUEDART-01")}
                          className="text-xs bg-sky-50 text-sky-600 font-bold px-3 py-1 rounded hover:bg-sky-100"
                        >
                          Auto-Assign Fleet
                        </button>
                      )}
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
