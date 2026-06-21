/**
 * Core Domain: Inventory Management
 * Handles concurrency-safe inventory mutations and stock reservations.
 */

export class ConcurrencyError extends Error {
  constructor(message: string) {
    super(`[STOCK_FAULT] ${message}`);
    this.name = "ConcurrencyError";
  }
}

export interface InventoryItem {
  sku: string;
  tenantId: string;
  warehouseId: string;
  onHandQuantity: number;
  reservedQuantity: number;
  version: number; // For Optimistic Concurrency Control (OCC)
}

export class StockMutator {
  /**
   * Safely reserves stock for a pending order.
   * Enforces Optimistic Concurrency to prevent overselling.
   */
  public static reserveStock(
    item: InventoryItem,
    requestedQty: number,
    expectedVersion: number,
  ): InventoryItem {
    // 1. Optimistic Concurrency Check
    if (item.version !== expectedVersion) {
      throw new ConcurrencyError(
        `State mismatch for SKU: ${item.sku}. Expected v${expectedVersion}, got v${item.version}. ` +
          `Another transaction modified this record.`,
      );
    }

    // 2. Availability Check
    const availableQty = item.onHandQuantity - item.reservedQuantity;
    if (requestedQty > availableQty) {
      throw new ConcurrencyError(
        `Insufficient stock for SKU: ${item.sku}. Requested: ${requestedQty}, Available: ${availableQty}.`,
      );
    }

    // 3. Mutation
    return {
      ...item,
      reservedQuantity: item.reservedQuantity + requestedQty,
      version: item.version + 1,
    };
  }

  /**
   * Confirms a dispatch, moving stock out of the warehouse entirely.
   */
  public static dispatchStock(
    item: InventoryItem,
    dispatchQty: number,
    expectedVersion: number,
  ): InventoryItem {
    if (item.version !== expectedVersion) {
      throw new ConcurrencyError(`State mismatch for SKU: ${item.sku}.`);
    }

    if (dispatchQty > item.reservedQuantity) {
      throw new ConcurrencyError(
        `Cannot dispatch more than reserved for SKU: ${item.sku}. ` +
          `Dispatch: ${dispatchQty}, Reserved: ${item.reservedQuantity}.`,
      );
    }

    return {
      ...item,
      onHandQuantity: item.onHandQuantity - dispatchQty,
      reservedQuantity: item.reservedQuantity - dispatchQty,
      version: item.version + 1,
    };
  }

  /**
   * Cancels a reservation, freeing up available stock.
   */
  public static releaseReservation(
    item: InventoryItem,
    releaseQty: number,
    expectedVersion: number,
  ): InventoryItem {
    if (item.version !== expectedVersion) {
      throw new ConcurrencyError(`State mismatch for SKU: ${item.sku}.`);
    }

    const actualRelease = Math.min(releaseQty, item.reservedQuantity);

    return {
      ...item,
      reservedQuantity: item.reservedQuantity - actualRelease,
      version: item.version + 1,
    };
  }
}
