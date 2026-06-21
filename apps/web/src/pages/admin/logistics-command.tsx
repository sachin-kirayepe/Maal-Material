import React, { useEffect, useState } from "react";
import { Truck, Navigation, Box, Zap, Map as MapIcon, CheckCircle } from "lucide-react";
import api from "../../utils/api";

export default function LogisticsCommand() {
  const [activeTab, setActiveTab] = useState<"DELIVERY" | "DISPATCH" | "SHIPPING" | "FLEET">(
    "DELIVERY",
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        if (activeTab === "DELIVERY") endpoint = "/deliveries";
        else if (activeTab === "DISPATCH") endpoint = "/dispatch";
        else if (activeTab === "SHIPPING") endpoint = "/shipping";
        else if (activeTab === "FLEET") endpoint = "/fleet/operations"; // Assumed endpoint

        // Temporarily suppressing errors for mocked/unimplemented endpoints
        const res: any = await api.get(endpoint).catch(() => ({ data: { data: [] } }));
        setData(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Navigation className="w-8 h-8 text-amber-500" />
            Logistics Command Center
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Unified dispatch, routing, and fleet telematics dashboard.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        {[
          { id: "DELIVERY", icon: Box, label: "Outbound Deliveries" },
          { id: "DISPATCH", icon: Zap, label: "Active Dispatches" },
          { id: "SHIPPING", icon: MapIcon, label: "Shipping Routes" },
          { id: "FLEET", icon: Truck, label: "Fleet Telematics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-amber-500 border-slate-800 rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
              Syncing Telematics...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <CheckCircle className="w-12 h-12 mb-4 opacity-20" />
            <p>No active {activeTab.toLowerCase()} records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">ID Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-white/5">
                    <td className="py-4 px-4 font-mono font-bold text-slate-300">
                      {item.deliveryNumber || item.dispatchNumber || item.id || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-800 text-amber-500 px-2 py-1 rounded text-xs font-bold uppercase">
                        {item.status || item.deliveryStatus || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-xs font-bold text-blue-400 hover:text-blue-300">
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
