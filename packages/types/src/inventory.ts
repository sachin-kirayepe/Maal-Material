// ============================================================
// Maal-Material Inventory Domain Types
// ============================================================

export enum StockMovementType {
  STOCK_IN = "STOCK_IN",
  STOCK_OUT = "STOCK_OUT",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
  RESERVATION = "RESERVATION",
  RETURN = "RETURN",
}

export enum StockAdjustmentType {
  RECOUNT = "RECOUNT",
  DAMAGE = "DAMAGE",
  LOSS = "LOSS",
  CORRECTION = "CORRECTION",
  WRITE_OFF = "WRITE_OFF",
}

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum UnitType {
  QUANTITY = "quantity",
  WEIGHT = "weight",
  LENGTH = "length",
  VOLUME = "volume",
  AREA = "area",
}

export enum ReferenceType {
  PURCHASE_ORDER = "PURCHASE_ORDER",
  SALES_ORDER = "SALES_ORDER",
  MANUAL = "MANUAL",
  TRANSFER = "TRANSFER",
}

// ---- Interfaces ----

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  subCategories?: SubCategory[];
  productCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  category?: Category;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  unitType: UnitType | string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string | null;
  description: string | null;
  shortDescription: string | null;
  image: string | null;
  images: string | null;
  categoryId: string;
  subCategoryId: string | null;
  unitId: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  taxPercent: number;
  taxCategory: string | null;
  minimumStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  trackInventory: boolean;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  manufacturer: string | null;
  hsn: string | null;
  category?: Category;
  subCategory?: SubCategory | null;
  unit?: Unit;
  totalStock?: number;
  warehouseStocks?: WarehouseStock[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string | null;
  priceOffset: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  isActive: boolean;
  isPrimary: boolean;
  stockCount?: number;
  totalValue?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface WarehouseStock {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  reservedQty: number;
  damagedQty: number;
  availableQty?: number;
  lastCountedAt: string | null;
  warehouse?: Warehouse;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  movementType: StockMovementType | string;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  fromWarehouseId: string | null;
  toWarehouseId: string | null;
  unitCost: number | null;
  totalCost: number | null;
  notes: string | null;
  performedBy: string;
  product?: Product;
  fromWarehouse?: Warehouse | null;
  toWarehouse?: Warehouse | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryDashboard {
  totalProducts: number;
  activeProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalWarehouses: number;
  totalInventoryValue: number;
  totalStockQuantity: number;
  recentMovements: StockMovement[];
}
