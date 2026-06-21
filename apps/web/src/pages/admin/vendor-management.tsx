import React, { useEffect } from "react";
import { useVendorStore } from "../../stores/vendorStore";

export default function VendorManagement() {
  const { vendors, fetchVendors, isLoading } = useVendorStore();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
        Vendor Management Ecosystem
      </h1>

      {isLoading ? (
        <p className="text-slate-400">Loading vendors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl hover:border-blue-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm font-mono text-slate-400 mt-1">{vendor.code}</p>
                </div>
                <span className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-slate-300">
                  {vendor.type}
                </span>
              </div>
              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Region</span>
                  <span className="font-semibold">{(vendor as any).region || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Terms</span>
                  <span className="font-semibold">{(vendor as any).paymentTerms || "N/A"}</span>
                </div>
                {vendor.scores && vendor.scores[0] && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Performance Score</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {vendor.scores[0].overallScore}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
