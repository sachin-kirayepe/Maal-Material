import React, { useEffect } from "react";
import { useEquipmentStore } from "../../stores/equipmentStore";
import { Tractor as TractorIcon, IndianRupee as IndianRupeeIcon } from "lucide-react";
const Tractor = TractorIcon as any;
const IndianRupee = IndianRupeeIcon as any;

export default function EquipmentMarketplace() {
  const { equipment, fetchEquipment, isLoading } = useEquipmentStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchEquipment(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Tractor className="w-8 h-8 mr-3 text-yellow-600" /> Equipment Marketplace
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Heavy Machinery & Fleet Rental Discovery</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center p-8 text-gray-500">Loading fleet catalog...</div>
        ) : (
          equipment.map((eq) => (
            <div
              key={eq.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{eq.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${eq.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {eq.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Category:{" "}
                  <span className="font-semibold text-gray-700">
                    {eq.category.replace("_", " ")}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Location: <span className="font-semibold text-gray-700">{eq.location}</span>
                </p>

                {eq.pricing && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Daily Rate:</span>
                      <span className="font-bold flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" /> {eq.pricing.dailyRate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-bold flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" /> {eq.pricing.hourlyRate}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  disabled={eq.status !== "AVAILABLE"}
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${eq.status === "AVAILABLE" ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  Request Booking
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
