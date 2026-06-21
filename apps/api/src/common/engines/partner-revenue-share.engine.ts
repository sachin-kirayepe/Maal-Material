import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PartnerRevenueShareEngine — "The Ecosystem Payout Engine" (Phase 22)
 *
 * Routes cleared funds to third-party developers, marketplace vendors,
 * and hardware partners in the Maal-Material ecosystem.
 */
@Injectable()
export class PartnerRevenueShareEngine {
  private readonly logger = new Logger(PartnerRevenueShareEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Accrues revenue for a partner.
   */
  async accrueRevenue(partnerId: string, transactionId: string, revenueShare: number) {
    this.logger.log(`Accruing Partner Revenue Share for [${partnerId}] - Amount: $${revenueShare}`);

    const payout = await this.prisma.partnerRevenueShareLedger.create({
      data: {
        partnerId,
        transactionId,
        revenueShare,
        payoutStatus: "ACCRUED",
      },
    });

    return payout;
  }
}
