"use client";

import React from "react";
import { Smartphone, CheckCircle, XCircle, Search, MapPin, Activity } from "lucide-react";

import { useDeviceStore } from "../../../stores/deviceStore";

export default function DeviceManagement() {
  const { devices, isLoading, fetchDevices } = useDeviceStore();

  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Smartphone className="text-blue-500" size={28} /> Mobile Device Management
          </h1>
          <p className="text-zinc-400">Approve or revoke access for field worker devices connecting to the Maal-Material ecosystem.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input type="text" placeholder="Search by user or device ID..." className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700">Total: 142</span>
            <span className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20">Pending: 3</span>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Device & User</th>
              <th className="p-4 font-medium">Specs</th>
              <th className="p-4 font-medium">Network Details</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading devices...</td></tr>
            ) : devices.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800">No devices found.</td></tr>
            ) : (
              devices.map((device: any, i: number) => (
              <tr key={device.id || i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{device.user || device.name || "Unknown User"}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{device.role || "Device"} • {device.deviceUuid || device.id}</div>
                </td>
                <td className="p-4">
                  <div className="text-zinc-300">{device.model || "Mobile Device"}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{device.os || "Unknown OS"}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs"><Activity size={12}/> IP: {device.ip || "192.168.1.x"}</div>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5"><MapPin size={12}/> Geofence: Active</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                    device.status === 'Approved' || device.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    device.status === 'Pending' || device.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {device.status || "UNKNOWN"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {device.status === 'Pending' || device.status === 'PENDING' ? (
                    <div className="flex justify-end gap-2">
                      <button className="flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        <CheckCircle size={14}/> Approve
                      </button>
                      <button className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        <XCircle size={14}/> Reject
                      </button>
                    </div>
                  ) : (
                    <button className="text-zinc-500 hover:text-white text-xs underline decoration-zinc-700 underline-offset-4">View Logs</button>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
