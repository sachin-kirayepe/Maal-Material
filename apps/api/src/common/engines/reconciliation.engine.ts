import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * ReconciliationEngine
 *
 * Automates the matching process between Expected internal transactions
 * (Invoices, Settlements) and Actual external bank records.
 * Flags discrepancies for manual review and maintains financial consistency.
 */
@Injectable()
export class ReconciliationEngine {
  private readonly logger = new Logger(ReconciliationEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Attempts to auto-match a bank transaction with an expected platform payment.
   */
  async autoMatchBankTransaction(
    tenantId: string,
    bankAccountId: string,
    externalTxId: string,
    amount: number,
    referenceStr: string,
  ) {
    this.logger.log(
      `Attempting auto-reconciliation for bank Tx: ${externalTxId} (Amount: ${amount})`,
    );

    // 1. Search for pending payments that match amount exactly
    // Payment schema does not have a status field, using unusedAmount > 0 as a proxy for "pending"
    const pendingPayments = await this.prisma.payment.findMany({
      where: { tenantId, totalAmount: amount, unusedAmount: { gt: 0 } },
    });

    let matchedPayment = null;
    let confidence = "LOW";

    if (pendingPayments.length === 1) {
      matchedPayment = pendingPayments[0];
      confidence = "HIGH"; // Exact amount match with single pending candidate
    } else if (pendingPayments.length > 1) {
      // 2. Tie-breaker: Check if the reference string (e.g. invoice number) is in the bank description
      const refMatch = pendingPayments.find(
        (p) => p.referenceNumber && referenceStr.includes(p.referenceNumber),
      );
      if (refMatch) {
        matchedPayment = refMatch;
        confidence = "HIGH";
      }
    }

    if (matchedPayment && confidence === "HIGH") {
      // Execute the reconciliation match
      const record = await this.prisma.reconciliationRecord.create({
        data: {
          tenantId,
          bankAccountId,
          periodStart: new Date(), // using now as period start/end for individual tx match
          periodEnd: new Date(),
          systemBalance: matchedPayment.totalAmount,
          statementBalance: amount,
          difference: 0,
          status: "MATCHED",
          notes: `Auto-matched to Payment ID: ${matchedPayment.id}`,
        },
      });

      // Update payment status (deduct unusedAmount)
      await this.prisma.payment.update({
        where: { id: matchedPayment.id },
        data: { unusedAmount: 0, paymentDate: new Date() },
      });

      this.eventDispatcher.dispatch("finance", "reconciliation_matched", {
        tenantId,
        reconciliationId: record.id,
        paymentId: matchedPayment.id,
      });

      return record;
    } else {
      // Discrepancy or unable to match safely
      this.logger.warn(
        `Reconciliation failed to auto-match Tx: ${externalTxId}. Flagged for review.`,
      );

      const record = await this.prisma.reconciliationRecord.create({
        data: {
          tenantId,
          bankAccountId,
          periodStart: new Date(),
          periodEnd: new Date(),
          systemBalance: 0, // Unknown
          statementBalance: amount,
          difference: amount,
          status: "DISCREPANCY",
          notes: `Unmatched bank transaction. Ref: ${referenceStr}`,
        },
      });

      this.eventDispatcher.dispatch("finance", "reconciliation_discrepancy", {
        tenantId,
        reconciliationId: record.id,
      });

      return record;
    }
  }
}
