import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseSubscriptionOrchestrationEngine — "The SaaS Brain" (Phase 22)
 *
 * Manages the lifecycle of enterprise subscriptions, enforcing tier limits
 * and handling automated billing cycles.
 */
@Injectable()
export class EnterpriseSubscriptionOrchestrationEngine {
  private readonly logger = new Logger(EnterpriseSubscriptionOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Provisions or updates an enterprise subscription.
   */
  async provisionSubscription(
    tenantId: string,
    tier: string,
    monthlySeatLimit: number,
    billingCycleEnd: Date,
  ) {
    this.logger.log(`Provisioning Subscription Tier [${tier}] for Tenant [${tenantId}]`);

    const subscription = await this.prisma.enterpriseSubscriptionBilling.upsert({
      where: { tenantId },
      update: {
        tier,
        monthlySeatLimit,
        billingCycleEnd,
        status: "ACTIVE",
      },
      create: {
        tenantId,
        tier,
        monthlySeatLimit,
        billingCycleEnd,
        status: "ACTIVE",
      },
    });

    return subscription;
  }
}
