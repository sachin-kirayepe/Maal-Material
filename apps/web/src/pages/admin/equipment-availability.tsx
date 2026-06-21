import React from "react";
import { CalendarRange as CalendarRangeIcon } from "lucide-react";
const CalendarRange = CalendarRangeIcon as any;

export default function EquipmentAvailabilityPanel() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <CalendarRange className="w-8 h-8 mr-3 text-red-600" /> Availability & Scheduling Engine
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Conflict-Safe Transactional Ledger</p>
        </div>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-600 font-medium">
          Select an asset from the marketplace to view its blocked schedule.
        </p>
      </div>
    </div>
  );
}
