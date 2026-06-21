import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketplaceCommissionEngine — "The Commercial Router" (Phase 22)
 *
 * Calculates dynamic commission splits and fee structures for transactions
 * flowing through the industrial internet ecosystem.
 */
@Injectable()
export class MarketplaceCommissionEngine {
  private readonly logger = new Logger(MarketplaceCommissionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Orchestrates a split payment commission.
   */
  async calculateCommission(
    transactionId: string,
    totalValue: number,
    platformFeePercentage: number,
  ) {
    this.logger.log(
      `Calculating Marketplace Commission for Tx [${transactionId}] - Total Value: $${totalValue}`,
    );

    const platformFeeAmount = totalValue * (platformFeePercentage / 100);
    const partnerAmount = totalValue - platformFeeAmount;

    const commission = await this.prisma.marketplaceCommissionOrchestrator.create({
      data: {
        transactionId,
        totalValue,
        platformFeeAmount,
        partnerAmount,
        status: "PENDING_CLEARANCE",
      },
    });

    return commission;
  }
}
