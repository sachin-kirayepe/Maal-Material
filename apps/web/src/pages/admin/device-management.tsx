import React, { useEffect } from "react";
import { useDeviceStore } from "../../stores/deviceStore";

export default function DeviceManagement() {
  const { devices, isLoading, error, fetchDevices, blockDevice } = useDeviceStore();

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  if (isLoading) return <div className="p-8 text-white">Loading Devices...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Device Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-[#111] p-6 rounded-xl border border-indigo-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{device.name || "Unnamed Device"}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${device.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {device.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">OS: {device.os}</p>
              <p className="text-sm text-gray-400 mb-2">
                UUID: <span className="font-mono text-xs">{device.deviceUuid}</span>
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${device.batteryLevel || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{device.batteryLevel}%</span>
              </div>
            </div>
            {device.status === "ACTIVE" && (
              <button
                onClick={() => blockDevice(device.id)}
                className="mt-6 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors text-sm font-semibold"
              >
                Remote Wipe / Block
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
