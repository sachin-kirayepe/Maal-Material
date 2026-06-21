"use client";

import React from "react";
import { Calculator, AlertTriangle, FileSignature, RefreshCcw, Save } from "lucide-react";

import { useProductsStore } from "../../../stores/productsStore";

export default function StockAdjustment() {
  const { products: inventoryItems, isLoading, fetchProducts } = useProductsStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Calculator className="text-blue-500" size={28} /> Raw Stock Adjustment
          </h1>
          <p className="text-zinc-400">Perform physical stock audits, reconcile differences, and log shrinkage or wastage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Adjustment Table */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
            <div>
              <h2 className="text-xl font-medium">Bhiwandi Central Hub (Audit Mode)</h2>
              <p className="text-xs text-zinc-500 mt-1">Last audited: 14 days ago</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-400 transition-colors text-sm">
              <Save size={16}/> Save Adjustments
            </button>
          </div>
          
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4 text-center">System Qty</th>
                <th className="px-6 py-4 text-center">Physical Count</th>
                <th className="px-6 py-4 text-center">Variance</th>
                <th className="px-6 py-4">Reason Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading stock inventory...</td></tr>
              ) : inventoryItems.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No stock found for adjustment.</td></tr>
              ) : (
                inventoryItems.map((item: any, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">{item.sku || `SKU-${i+1000}`}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-zinc-300 bg-black border border-zinc-800 px-3 py-1 rounded-lg">{item.systemQty || item.quantity || 0} {item.unit || item.uom || "Unit"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <input 
                        type="number" 
                        defaultValue={item.systemQty || item.quantity || 0} 
                        className={`w-24 bg-black border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-blue-500 text-white border-zinc-800`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-500 font-medium">0</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-600 text-xs italic">N/A</span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Approval Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> Audit Summary</h3>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Items Scanned</span>
                <span className="text-white">45 / 800</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Net Value Variance</span>
                <span className="text-red-400 font-medium">- ₹1,925</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">Adjustments resulting in a value variance greater than ₹5,000 require Manager Approval.</p>
              
              <button className="w-full bg-zinc-800 text-white py-2.5 rounded-xl font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FileSignature size={16}/> Request Approval
              </button>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl flex gap-3 items-start">
            <RefreshCcw size={20} className="text-blue-400 shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-1">Auto-Sync Enabled</h4>
              <p className="text-xs text-blue-400/70">Once saved, stock levels will be updated across the network immediately.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
