import React, { useEffect, useState } from "react";
import { Store, ShieldCheck, Tag, ShoppingCart, Globe, Zap } from "lucide-react";
import { useVendorStore } from "../../stores/vendorStore";

export default function VendorExchange() {
  const { vendors, rfqs, fetchVendors, fetchRfqs, isLoading } = useVendorStore();
  const [activeTab, setActiveTab] = useState<"VENDORS" | "RFQS" | "MARKETPLACE">("VENDORS");

  useEffect(() => {
    fetchVendors();
    fetchRfqs();
  }, [fetchVendors, fetchRfqs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Vendor Ecosystem Exchange
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            B2B Marketplace, RFQ Engine, and Supplier Discovery.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        {[
          { id: "VENDORS", icon: Store, label: "Vendor Directory" },
          { id: "RFQS", icon: Tag, label: "RFQ Exchange" },
          { id: "MARKETPLACE", icon: ShoppingCart, label: "B2B Marketplace" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-primary border-slate-800 rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
              Querying Network...
            </p>
          </div>
        ) : activeTab === "VENDORS" ? (
          vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Store className="w-12 h-12 mb-4 opacity-20" />
              <p>No vendors found in network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-slate-900 border border-white/5 p-5 rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{vendor.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{vendor.code}</p>
                    </div>
                    <ShieldCheck
                      className={`w-5 h-5 ${vendor.status === "VERIFIED" ? "text-emerald-500" : "text-slate-600"}`}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {vendor.type}
                    </span>
                    <button className="text-xs font-bold text-primary hover:text-primary/80">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === "RFQS" ? (
          rfqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Tag className="w-12 h-12 mb-4 opacity-20" />
              <p>No active RFQs in exchange.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">RFQ ID</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-white/5">
                      <td className="py-4 px-4 font-mono font-bold text-slate-300">{rfq.id}</td>
                      <td className="py-4 px-4 text-slate-400">{rfq.name || "Untitled RFQ"}</td>
                      <td className="py-4 px-4">
                        <span className="bg-slate-800 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                          {rfq.isActive ? "OPEN" : "CLOSED"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300">
                          Bid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Zap className="w-12 h-12 mb-4 opacity-20" />
            <p>B2B Marketplace Catalog is currently synchronizing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
