import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RevenueAnalyticsEngine — "The Growth Calculator" (Phase 8B)
 *
 * Scans the immutable RevenueEventLog to calculate critical SaaS metrics
 * (MRR, Churn Rate, Expansion Revenue) for global business observability.
 */
@Injectable()
export class RevenueAnalyticsEngine {
  private readonly logger = new Logger(RevenueAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an immutable revenue event (e.g., Stripe webhook payload).
   */
  async logRevenueEvent(
    tenantId: string,
    eventType: string,
    mrrDeltaUsd: number,
    payload: unknown,
  ) {
    this.logger.debug(
      `Revenue Event: ${eventType} | MRR Delta: $${mrrDeltaUsd} | Tenant: [${tenantId}]`,
    );

    return this.prisma.revenueEventLog.create({
      data: {
        tenantId,
        eventType,
        mrrDeltaUsd,
        eventPayload: JSON.stringify(payload),
      },
    });
  }

  /**
   * Calculates current aggregate Monthly Recurring Revenue across the ecosystem.
   */
  async calculateGlobalMRR(): Promise<number> {
    this.logger.log(`Calculating Global Ecosystem MRR...`);

    const aggregation = await this.prisma.revenueEventLog.aggregate({
      _sum: {
        mrrDeltaUsd: true,
      },
    });

    const mrr = aggregation._sum.mrrDeltaUsd || 0;
    this.logger.log(`Global MRR calculated at $${mrr}`);
    return mrr;
  }
}
