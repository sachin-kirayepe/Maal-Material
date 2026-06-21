import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * TransactionReconciliationDeadLetterEngine — "The Recovery Sweeper" (Phase 21)
 *
 * Ensures no distributed transaction is ever permanently lost due to a
 * network partition or database lock timeout by sweeping failed txs into a dead letter queue.
 */
@Injectable()
export class TransactionReconciliationDeadLetterEngine {
  private readonly logger = new Logger(TransactionReconciliationDeadLetterEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Captures a failed distributed transaction for later reconciliation.
   */
  async captureFailedTransaction(
    tenantId: string,
    transactionId: string,
    failureReason: string,
    transactionData: unknown,
  ) {
    this.logger.error(
      `Capturing Failed Transaction [${transactionId}] for Tenant [${tenantId}]. Reason: ${failureReason}`,
    );

    const deadLetter = await this.prisma.distributedTransactionDeadLetter.create({
      data: {
        tenantId,
        transactionId,
        failureReason,
        transactionData: JSON.stringify(transactionData),
        reconciliationState: "REQUIRES_MANUAL_REVIEW",
      },
    });

    return deadLetter;
  }
}
