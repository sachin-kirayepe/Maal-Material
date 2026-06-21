import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ReputationProfileEngine — "The Reputation Architect"
 *
 * Manages multi-dimensional reputation profiles for ecosystem participants.
 * Recalculates dimension scores when new trust signals arrive.
 */
@Injectable()
export class ReputationProfileEngine {
  private readonly logger = new Logger(ReputationProfileEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Gets or creates a reputation profile for an entity.
   */
  async getOrCreateProfile(tenantId: string, entityType: string, entityId: string) {
    let profile = await this.prisma.reputationProfile.findUnique({
      where: { tenantId_entityType_entityId: { tenantId, entityType, entityId } },
    });

    if (!profile) {
      this.logger.debug(`Creating new reputation profile for [${entityType}:${entityId}]`);
      profile = await this.prisma.reputationProfile.create({
        data: { tenantId, entityType, entityId },
      });
    }

    return profile;
  }

  /**
   * Recalculates the overall reputation from individual dimensions and assigns a trust tier.
   */
  async recalculateReputation(tenantId: string, entityType: string, entityId: string) {
    const profile = await this.getOrCreateProfile(tenantId, entityType, entityId);

    // Weighted composite score
    const overall =
      profile.deliveryReliability * 0.3 +
      profile.qualityScore * 0.3 +
      profile.paymentPunctuality * 0.25 +
      (1.0 - profile.disputeRate) * 0.15;

    // Determine tier based on overall reputation
    let tier = "TIER_1";
    if (overall >= 0.9) tier = "TIER_ELITE";
    else if (overall >= 0.75) tier = "TIER_3";
    else if (overall >= 0.55) tier = "TIER_2";

    this.logger.log(
      `Reputation recalculated for [${entityType}:${entityId}]: ${overall.toFixed(3)} → ${tier}`,
    );

    return this.prisma.reputationProfile.update({
      where: { id: profile.id },
      data: { overallReputation: overall, currentTier: tier, lastRecalculatedAt: new Date() },
    });
  }
}
