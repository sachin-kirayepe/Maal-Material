export const DomainEvents = {
  // Order Events
  ORDER_CREATED: "order!.created",
  ORDER_CONFIRMED: "order!.confirmed",
  ORDER_FULFILLED: "order!.fulfilled",
  ORDER_CANCELLED: "order!.cancelled",

  // Inventory Events
  STOCK_REDUCED: "stock.reduced",
  STOCK_INCREASED: "stock.increased",
  STOCK_ADJUSTED: "stock.adjusted",
  STOCK_TRANSFERRED: "stock.transferred",

  // Logistics Events
  DELIVERY_CREATED: "delivery.created",
  DELIVERY_ASSIGNED: "delivery.assigned",
  DELIVERY_COMPLETED: "delivery.completed",
  DISPATCH_PACKED: "dispatch.packed",

  // Finance Events
  INVOICE_CREATED: "invoice.created",
  INVOICE_PAID: "invoice.paid",
  PAYMENT_RECEIVED: "payment.received",

  // ERP Events
  LABOR_ACCRUED: "labor.accrued",
  MATERIAL_CONSUMED: "material.consumed",
  PROJECT_CREATED: "project.created",
};

// Base Interface for all Domain Events
export interface BaseDomainEvent {
  userId?: string;
  timestamp: Date;
}

// Example specific event types
export interface OrderConfirmedEvent extends BaseDomainEvent {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
}

export interface StockReducedEvent extends BaseDomainEvent {
  warehouseId: string;
  productId: string;
  quantity: number;
}
