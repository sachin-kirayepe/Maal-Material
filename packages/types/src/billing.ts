export enum CustomerType {
  RETAIL = "RETAIL",
  CONTRACTOR = "CONTRACTOR",
  BUSINESS = "BUSINESS",
  WHOLESALE = "WHOLESALE",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CASH = "CASH",
  UPI = "UPI",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  CARD = "CARD",
}

export interface CustomerDTO {
  id: string;
  name: string;
  companyName?: string;
  mobile: string;
  email?: string;
  gstin?: string;
  customerType: CustomerType;
  creditLimit: number;
  totalDue: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItemDTO {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  hsn?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string;
  customerId: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  issueDate: string;
  dueDate?: string;
  cancelledAt?: string;
  notes?: string;
  terms?: string;
  createdBy: string;
  createdAt: string;
  items: InvoiceItemDTO[];
}
