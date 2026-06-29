import React, { useEffect } from "react";
import { useCommerceNetworkStore } from "../../stores/commerceNetworkStore";
import { ArrowRightLeft as ArrowRightLeftIcon, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { IndustrialCatalogGrid } from "../../components/marketplace/IndustrialCatalogGrid";
import { AIChatInterface } from "../../components/ai/AIChatInterface";
import { useTenantId } from "@/hooks/useTenantId";

const ArrowRightLeft = ArrowRightLeftIcon as any;
const ShoppingBag = ShoppingBagIcon as any;

export default function B2BExchangeDashboard() {
  const { nodes, fetchGraph, isLoading } = useCommerceNetworkStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchGraph(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative pb-24">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-blue-600" /> B2B Marketplace & Exchange
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Global AI-Assisted Procurement Catalog</p>
        </div>
      </header>

      {/* Heavy Machinery Catalog */}
      <section>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Heavy Machinery Catalog</h2>
          <span className="ml-3 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Live Negotiable
          </span>
        </div>
        <IndustrialCatalogGrid />
      </section>

      {/* Network Topology */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <ArrowRightLeft className="w-5 h-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">Trading Network Topology</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Mapping relationships...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Node / Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Reputation (Graph)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nodes.map((node) => (
                  <tr key={node.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {node.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {node.nodeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {node.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {node.reputationScore} / 1000
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Overlay AI Chat Interface */}
      <AIChatInterface />
    </div>
  );
}
