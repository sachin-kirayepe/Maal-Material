import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Booking {
  id: string;
  equipmentId: string;
  contractorId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
}

interface RentalsState {
  bookings: Booking[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  fetchBookings: (tenantId: string, page?: number, limit?: number) => Promise<void>;
  approveBooking: (id: string, tenantId?: string) => Promise<void>;
}

export const useRentalsStore = create<RentalsState>((set, get) => ({
  bookings: [],
  meta: null,
  isLoading: false,
  fetchBookings: async (tenantId: string, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await ApiClient.get<any>(`/api/v1/rentals?tenantId=${tenantId}&page=${page}&limit=${limit}`);
      const data = response?.data || response;
      set({
        isLoading: false,
        bookings: data.data || data || [],
        meta: data.meta || null,
      });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      set({ isLoading: false });
    }
  },
  approveBooking: async (id: string, tenantId?: string) => {
    // Optimistic UI update
    const previousBookings = get().bookings;
    set({
      bookings: previousBookings.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b)),
    });

    try {
      await ApiClient.patch<any>(`/rentals/${id}/approve`, { tenantId });
    } catch (error) {
      console.error("Failed to approve booking:", error);
      // Revert optimistic update
      set({ bookings: previousBookings });
    }
  },
}));
