import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CommerceSynchronizationEngine — "The Ecosystem Ledger" (Phase 3P)
 *
 * Ensures that complex B2B transactions remain perfectly synced across
 * all involved tenants, aligning physical realities with financial ledgers.
 */
@Injectable()
export class CommerceSynchronizationEngine {
  private readonly logger = new Logger(CommerceSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a multi-party commerce synchronization state.
   */
  async initiateCommerceSync(
    tenantId: string,
    partnerTenantId: string,
    transactionId: string,
    initialPayload: unknown,
  ) {
    this.logger.log(
      `Initiating Commerce Sync [Tx: ${transactionId}] between [${tenantId}] and [${partnerTenantId}]`,
    );

    return this.prisma.commerceSynchronizationState.create({
      data: {
        tenantId,
        partnerTenantId,
        transactionId,
        syncStatus: "INITIATED",
        financialPayloadJson: JSON.stringify(initialPayload),
      },
    });
  }

  /**
   * Updates the ledger state when a physical or financial milestone is reached.
   */
  async advanceSyncState(transactionId: string, newStatus: string, updatedPayload: unknown) {
    this.logger.debug(`Advancing Sync State [Tx: ${transactionId}] -> ${newStatus}`);

    return this.prisma.commerceSynchronizationState.update({
      where: { transactionId },
      data: {
        syncStatus: newStatus,
        financialPayloadJson: JSON.stringify(updatedPayload),
      },
    });
  }
}
