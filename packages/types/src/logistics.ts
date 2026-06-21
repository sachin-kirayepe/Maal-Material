export type DriverAvailability = "AVAILABLE" | "ON_DELIVERY" | "OFF_DUTY" | "INACTIVE";

export type VehicleType = "BIKE" | "AUTO" | "PICKUP" | "MINI_TRUCK" | "TRUCK";

export type VehicleOperationalStatus = "ACTIVE" | "MAINTENANCE" | "RETIRED";

export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "DISPATCHED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

export type DispatchStatus =
  | "PENDING"
  | "APPROVED"
  | "PICKING"
  | "PACKED"
  | "DISPATCHED"
  | "CANCELLED";

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  licenseNumber: string;
  availabilityStatus: DriverAvailability;
  isActive: boolean;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  tenantId?: string | null;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: VehicleType;
  make?: string | null;
  model?: string | null;
  capacity: number;
  operationalStatus: VehicleOperationalStatus;
  isActive: boolean;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  tenantId?: string | null;
}

export interface ShippingZone {
  id: string;
  name: string;
  code: string;
  cities?: string | null;
  state?: string | null;
  baseCost: number;
  perKmCost: number;
  estimatedDays: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  tenantId?: string | null;
}

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  orderItemId?: string | null;
  productId: string;
  productName: string;
  sku?: string | null;
  quantity: number;
  deliveredQty: number;
  damagedQty: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DeliveryTimeline {
  id: string;
  deliveryId: string;
  status: string;
  description?: string | null;
  location?: string | null;
  createdBy: string;
  createdAt: string | Date;
}

export interface DeliveryProof {
  id: string;
  deliveryId: string;
  recipientName: string;
  recipientSignature?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
  receivedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  orderId: string;
  fulfillmentId?: string | null;
  customerId: string;
  warehouseId?: string | null;
  driverId?: string | null;
  vehicleId?: string | null;
  shippingZoneId?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPincode?: string | null;
  deliveryStatus: DeliveryStatus;
  scheduledDate?: string | Date | null;
  actualDeliveryDate?: string | Date | null;
  estimatedDelivery?: string | Date | null;
  deliveryNotes?: string | null;
  failureReason?: string | null;
  returnReason?: string | null;
  deliveryCost: number;
  weight: number;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relations mapped from backend
  customer?: any;
  driver?: Driver;
  vehicle?: Vehicle;
  items?: DeliveryItem[];
  timeline?: DeliveryTimeline[];
  proof?: DeliveryProof;
}

export interface DispatchItem {
  id: string;
  dispatchId: string;
  productId: string;
  productName: string;
  quantity: number;
  pickedQty: number;
  packedQty: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Dispatch {
  id: string;
  dispatchNumber: string;
  warehouseId: string;
  deliveryId: string;
  status: DispatchStatus;
  approvedBy?: string | null;
  packedBy?: string | null;
  dispatchedAt?: string | Date | null;
  notes?: string | null;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relations
  warehouse?: any;
  delivery?: Delivery;
  items?: DispatchItem[];
  approver?: any;
  packer?: any;
}
