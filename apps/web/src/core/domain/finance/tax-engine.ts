/**
 * Core Domain: Taxation Engine
 * Handles complex GST calculation scenarios (Inter-state vs Intra-state).
 */

export interface TaxRegion {
  stateCode: string; // e.g., 'MH' for Maharashtra
  countryCode: string;
}

export interface TaxableItem {
  id: string;
  hsnCode: string; // Harmonized System of Nomenclature (used in GST)
  basePrice: number;
  quantity: number;
  taxRatePct: number; // e.g., 18 for 18% GST
}

export interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalWithTax: number;
}

export class TaxEngine {
  /**
   * Calculates Indian GST based on Origin and Destination regions.
   * If Origin State === Destination State: CGST (50%) + SGST (50%)
   * If Origin State !== Destination State: IGST (100%)
   */
  public static calculateIndianGST(
    origin: TaxRegion,
    destination: TaxRegion,
    items: TaxableItem[],
  ): TaxBreakdown {
    const isInterState = origin.stateCode !== destination.stateCode;

    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let baseAmount = 0;

    for (const item of items) {
      const lineTotal = item.basePrice * item.quantity;
      baseAmount += lineTotal;

      const taxAmount = lineTotal * (item.taxRatePct / 100);

      if (isInterState) {
        totalIgst += taxAmount;
      } else {
        totalCgst += taxAmount / 2;
        totalSgst += taxAmount / 2;
      }
    }

    const totalTax = totalCgst + totalSgst + totalIgst;

    return {
      cgst: Number(totalCgst.toFixed(2)),
      sgst: Number(totalSgst.toFixed(2)),
      igst: Number(totalIgst.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      totalWithTax: Number((baseAmount + totalTax).toFixed(2)),
    };
  }

  /**
   * Reverse calculates base price given a tax inclusive amount and rate.
   */
  public static extractBaseFromInclusive(inclusiveAmount: number, taxRatePct: number): number {
    // Formula: Base = Inclusive / (1 + (Rate/100))
    const base = inclusiveAmount / (1 + taxRatePct / 100);
    return Number(base.toFixed(2));
  }
}
