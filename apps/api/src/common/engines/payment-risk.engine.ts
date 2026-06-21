import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * PaymentRiskEngine
 *
 * Distinct from commerce fraud, this engine focuses strictly on transaction risk
 * (e.g., chargebacks, stolen cards, rapid payout attempts).
 * It halts risky financial transactions before they are processed by external gateways.
 */
@Injectable()
export class PaymentRiskEngine {
  private readonly logger = new Logger(PaymentRiskEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates a payment intent before it is authorized.
   * Returns true if safe, false if blocked.
   */
  async evaluatePaymentSafety(
    tenantId: string,
    entityType: string,
    entityId: string,
    amount: number,
  ) {
    this.logger.log(`Evaluating payment risk for ${entityType}:${entityId} (Amount: ${amount})`);

    const profile = await this.prisma.paymentRiskProfile.findUnique({
      where: { tenantId_entityType_entityId: { tenantId, entityType, entityId } },
    });

    if (!profile) {
      // First time transaction is usually allowed but watched
      await this.prisma.paymentRiskProfile.create({
        data: {
          tenantId,
          entityType,
          entityId,
          riskScore: 0.1,
          velocityScore: 0.1,
        },
      });
      return { isSafe: true, reason: "NEW_PROFILE" };
    }

    if (profile.status === "BLOCKED") {
      this.logger.warn(`Payment blocked: Entity ${entityId} is on the financial blocklist.`);
      return { isSafe: false, reason: "PROFILE_BLOCKED" };
    }

    // Velocity check (too many transactions recently)
    if (profile.velocityScore > 0.8) {
      this.logger.warn(`Payment blocked: High velocity risk for ${entityId}.`);
      return { isSafe: false, reason: "HIGH_VELOCITY" };
    }

    // Large transaction anomaly check
    // In a real AI setup, we would compare against average historical transaction size.
    // Here we use a static heuristic for demonstration.
    if (amount > 100000 && profile.riskScore > 0.4) {
      return { isSafe: false, reason: "LARGE_AMOUNT_HIGH_RISK" };
    }

    return { isSafe: true, reason: "WITHIN_THRESHOLDS" };
  }

  /**
   * Registers a chargeback and dramatically increases risk score.
   */
  async registerChargeback(tenantId: string, entityType: string, entityId: string, amount: number) {
    this.logger.error(`Chargeback registered for ${entityType}:${entityId} (Amount: ${amount})`);

    const profile = await this.prisma.paymentRiskProfile.upsert({
      where: { tenantId_entityType_entityId: { tenantId, entityType, entityId } },
      update: {
        riskScore: 1.0,
        chargebackRate: { increment: 1.0 },
        status: "BLOCKED",
        lastEvaluatedAt: new Date(),
      },
      create: {
        tenantId,
        entityType,
        entityId,
        riskScore: 1.0,
        chargebackRate: 1.0,
        velocityScore: 0.5,
        status: "BLOCKED",
      },
    });

    this.eventDispatcher.dispatch("finance", "payment_profile_blocked", {
      tenantId,
      entityType,
      entityId,
      reason: "CHARGEBACK_REGISTERED",
    });

    return profile;
  }
}
