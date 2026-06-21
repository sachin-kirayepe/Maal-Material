import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  orderedQty: number;
  fulfilledQty: number;
  unitPrice: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  customer?: {
    companyName: string;
    name: string;
  };
  items: OrderItem[];
}

interface OMSState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    fulfilledOrders: number;
    averageOrderValue: number;
  };
}

export const useOMSStore = create<OMSState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    fulfilledOrders: 0,
    averageOrderValue: 0,
  },

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>("/orders");
      const orders = response?.data || response || [];

      // Calculate basic stats
      const pending = orders.filter((o: Order) => o.orderStatus === "PENDING").length;
      const fulfilled = orders.filter((o: Order) => o.fulfillmentStatus === "FULFILLED").length;
      const totalRev = orders.reduce((sum: number, o: Order) => sum + o.grandTotal, 0);

      set({
        orders,
        isLoading: false,
        stats: {
          totalOrders: orders.length,
          pendingOrders: pending,
          fulfilledOrders: fulfilled,
          averageOrderValue: orders.length ? totalRev / orders.length : 0,
        },
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiClient.get<any>(`/orders/${id}`);
      const order = response?.data || response;
      set({ currentOrder: order, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await ApiClient.patch<any>(`/orders/${id}/status`, { status });
      await get().fetchOrders(); // Refresh list
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
