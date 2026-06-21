export type RFQStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "AWARDED" | "CANCELLED";

export interface SupplierProfile {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  location: string;
  deliveryTimeDays: number;
}

export interface RFQItem {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  expectedDeliveryDate: string;
}

export interface RFQ {
  id: string;
  title: string;
  projectCode: string;
  status: RFQStatus;
  createdAt: string;
  expiresAt: string;
  items: RFQItem[];
  bidsCount: number;
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplier: SupplierProfile;
  unitPrice: number;
  freightCharges: number;
  gstPercentage: number;
  totalCost: number;
  submittedAt: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  remarks?: string;
}
