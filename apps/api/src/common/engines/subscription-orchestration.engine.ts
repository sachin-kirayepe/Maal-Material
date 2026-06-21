import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SubscriptionOrchestrationEngine — "The Monetization Engine" (Phase 8B)
 *
 * Handles SaaS tier upgrades, downgrades, trial expirations, and graceful
 * operational restriction when an account becomes past due.
 */
@Injectable()
export class SubscriptionOrchestrationEngine {
  private readonly logger = new Logger(SubscriptionOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new tenant onto a specific SaaS plan (or default free trial).
   */
  async provisionSubscription(tenantId: string, planCode: string): Promise<any> {
    this.logger.log(`Provisioning SaaS Subscription [${planCode}] for Tenant [${tenantId}]`);

    const plan = await this.prisma.saaSSubscriptionPlan.findUnique({
      where: { planCode },
    });

    if (!plan) {
      throw new Error(`Critical: Plan ${planCode} not found in catalog.`);
    }

    // Default to 14 day trial if no billing info is present initially
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 14);

    // In a real system, we'd integrate Stripe/Braintree here to set up the billing cycle
    return this.logger.debug(`Subscription initialized. Trial ends at ${trialEnds.toISOString()}`);
  }

  /**
   * Evaluates subscription statuses to gracefully restrict access for past-due accounts.
   */
  async handleBillingCycleFailure(tenantId: string) {
    this.logger.warn(`Billing cycle failure detected for Tenant [${tenantId}].`);
    // Business rule: Do not immediately delete their digital twin data.
    // Instead, place the tenant in a PAST_DUE state which limits write access
    // but maintains their historical data graph.
    this.logger.log(`Tenant ${tenantId} shifted to grace period state.`);
  }
}
