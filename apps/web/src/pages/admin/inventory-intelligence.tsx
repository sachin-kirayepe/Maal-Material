import React, { useEffect } from "react";
import { usePredictionsStore } from "../../stores/predictionsStore";
import {
  Package as PackageIcon,
  TrendingDown as TrendingDownIcon,
  ShieldAlert as ShieldAlertIcon,
} from "lucide-react";
const Package = PackageIcon as any;
const TrendingDown = TrendingDownIcon as any;
const ShieldAlert = ShieldAlertIcon as any;

export default function InventoryIntelligence() {
  const { inventoryPredictions, fetchInventoryPredictions, isLoading } = usePredictionsStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchInventoryPredictions(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Package className="w-8 h-8 mr-3 text-blue-600" /> Inventory Intelligence
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Predictive Demand & Stock Optimization</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Stock Predictions & Reorder Points</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading AI predictions...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Predicted Demand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Reorder Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Dead Stock Prob
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Seasonality Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {pred.itemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pred.predictedDemand.toFixed(2)} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">
                      {pred.reorderPoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-bold ${pred.deadStockProb > 0.5 ? "text-red-600" : "text-green-600"}`}
                        >
                          {(pred.deadStockProb * 100).toFixed(0)}%
                        </span>
                        {pred.deadStockProb > 0.5 && (
                          <ShieldAlert className="w-4 h-4 ml-2 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-medium">
                        {(pred.seasonalityRisk * 100).toFixed(0)}%
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
