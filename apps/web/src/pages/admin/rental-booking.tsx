import React, { useEffect } from "react";
import { useRentalsStore } from "../../stores/rentalsStore";
import { CalendarCheck as CalendarCheckIcon, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import { useTenantId } from "@/hooks/useTenantId";
const CalendarCheck = CalendarCheckIcon as any;
const ShieldCheck = ShieldCheckIcon as any;

export default function RentalBookingCenter() {
  const { bookings, fetchBookings, approveBooking, isLoading } = useRentalsStore();
  const tenantId = useTenantId();

  useEffect(() => {
    fetchBookings(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <CalendarCheck className="w-8 h-8 mr-3 text-indigo-600" /> Rental Booking Coordination
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Approval Workflows & Reservation Ledger</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Active Booking Requests</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Syncing ledger...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Equipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {booking.contractorId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.equipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.startDate} to {booking.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{booking.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${booking.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {booking.status === "REQUESTED" && (
                        <button
                          onClick={() => approveBooking(booking.id)}
                          className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded hover:bg-indigo-100"
                        >
                          Approve & Lock Calendar
                        </button>
                      )}
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
