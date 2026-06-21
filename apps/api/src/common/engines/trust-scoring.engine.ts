import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * TrustScoringEngine
 *
 * Centralized trust evaluation engine that computes and updates TrustProfiles
 * for any ecosystem entity (Vendor, Contractor, Customer, Workforce).
 *
 * Trust Score Algorithm:
 *   - Base score:       500 (neutral)
 *   - KYC verified:     +100
 *   - GST verified:     +50
 *   - High reputation:  +150 (scaled from ReputationScore)
 *   - Low disputes:     +100 (inverse of dispute frequency)
 *   - Payment history:  +100 (from paymentReliability)
 *   - Fraud signals:    -200 per unresolved CRITICAL, -100 per HIGH
 *   - Capped at:        0 - 1000
 */
@Injectable()
export class TrustScoringEngine {
  private readonly logger = new Logger(TrustScoringEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Recalculates the trust score for a specific entity and persists the result.
   */
  async evaluateEntity(tenantId: string, entityType: string, entityId: string) {
    this.logger.log(`Evaluating trust for ${entityType}:${entityId} (Tenant: ${tenantId})`);

    let score = 500; // Neutral baseline

    // 1. KYC / GST verification bonuses
    const profile = await this.prisma.trustProfile.findUnique({
      where: { tenantId_entityType_entityId: { tenantId, entityType, entityId } },
    });

    if (profile) {
      if (profile.kycStatus === "VERIFIED") score += 100;
      if (profile.gstVerified) score += 50;
    }

    // 2. Reputation score integration (if entity is a vendor)
    const reputation = await this.prisma.reputationScore
      .findUnique({
        where: { tenantId_vendorId: { tenantId, vendorId: entityId } },
      })
      .catch(() => null);

    if (reputation) {
      // Weighted average of reputation dimensions, scaled to 0-150
      const avgReputation =
        reputation.deliveryConsistency * 0.3 +
        reputation.fulfillmentQuality * 0.3 +
        reputation.paymentReliability * 0.25 +
        (100 - Math.min(reputation.disputeFrequency * 10, 100)) * 0.15;
      score += Math.round((avgReputation / 100) * 150);
    }

    // 3. Fraud signal penalties
    const unresolvedFraudSignals = await this.prisma.fraudSignal.findMany({
      where: {
        tenantId,
        entityId,
        status: { in: ["OPEN", "INVESTIGATING"] },
      },
    });

    for (const signal of unresolvedFraudSignals) {
      if (signal.severity === "CRITICAL") score -= 200;
      else if (signal.severity === "HIGH") score -= 100;
      else if (signal.severity === "MEDIUM") score -= 50;
      else score -= 20;
    }

    // 4. Dispute penalty
    const openDisputes = await this.prisma.disputeCase.count({
      where: { tenantId, againstEntityId: entityId, status: { in: ["OPEN", "MEDIATION"] } },
    });
    score -= openDisputes * 30;

    // 5. Clamp score
    score = Math.max(0, Math.min(1000, score));

    // 6. Determine status based on score
    let status = "ACTIVE";
    if (score < 200) status = "BLOCKED";
    else if (score < 350) status = "SUSPENDED";

    // 7. Upsert TrustProfile
    const updatedProfile = await this.prisma.trustProfile.upsert({
      where: { tenantId_entityType_entityId: { tenantId, entityType, entityId } },
      update: {
        trustScore: score,
        operationalScore: reputation
          ? (reputation.deliveryConsistency + reputation.fulfillmentQuality) / 2
          : profile?.operationalScore || 0,
        status,
        lastEvaluatedAt: new Date(),
      },
      create: {
        tenantId,
        entityType,
        entityId,
        trustScore: score,
        status,
      },
    });

    // 8. Audit trail
    await this.prisma.trustAuditLog.create({
      data: {
        tenantId,
        action: "TRUST_SCORE_RECALCULATED",
        entityId,
        performedBy: "TrustScoringEngine",
        reason: `Score recalculated to ${score}. Status: ${status}.`,
      },
    });

    // 9. Emit event for downstream reactions (e.g., auto-suspend notifications)
    if (status === "BLOCKED" || status === "SUSPENDED") {
      this.eventDispatcher.dispatch("trust", "entity_trust_degraded", {
        tenantId,
        entityType,
        entityId,
        trustScore: score,
        status,
      });
    }

    return updatedProfile;
  }

  /**
   * Batch-evaluates all entities of a given type for a tenant!.
   * Useful for periodic cron-based trust recalculation.
   */
  async batchEvaluateByType(tenantId: string, entityType: string) {
    const profiles = await this.prisma.trustProfile.findMany({
      where: { tenantId, entityType },
    });

    const results = [];
    for (const profile of profiles) {
      const result = await this.evaluateEntity(tenantId, entityType, profile.entityId);
      results.push(result);
    }

    this.logger.log(
      `Batch trust evaluation complete for ${entityType}: ${results.length} entities processed.`,
    );
    return results;
  }
}
