import React, { useEffect } from "react";
import { useInventorySharingStore } from "../../stores/inventorySharingStore";
import { Package as PackageIcon, Truck as TruckIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const Package = PackageIcon as any;
const Truck = TruckIcon as any;

export default function InventorySharingNetwork() {
  const { transfers, fetchTransfers, updateTransferStatus, isLoading } = useInventorySharingStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchTransfers(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Package className="w-8 h-8 mr-3 text-teal-600" /> Inventory Sharing Network
          </h1>
          <p className="text-gray-500 mt-2 font-medium">P2P Stock Exchange & Visibility</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-teal-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Stock Transfers</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Syncing ledger...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Qty
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
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {t.sourceEntityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {t.targetEntityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.itemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-600">
                      {t.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${t.status === "INTENT_REGISTERED" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {t.status === "INTENT_REGISTERED" && (
                        <button
                          onClick={() => updateTransferStatus(t.id, "IN_TRANSIT")}
                          className="text-xs bg-teal-50 text-teal-600 font-bold px-3 py-1 rounded hover:bg-teal-100"
                        >
                          Dispatch Stock
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
