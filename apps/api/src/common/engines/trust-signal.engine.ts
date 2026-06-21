import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ReputationProfileEngine } from "./reputation-profile.engine";

/**
 * TrustSignalEngine — "The Behavioral Observer"
 *
 * Ingests operational trust signals (+/-), weights them by recency and severity,
 * and feeds them into the reputation profile recalculation pipeline.
 */
@Injectable()
export class TrustSignalEngine {
  private readonly logger = new Logger(TrustSignalEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reputationEngine: ReputationProfileEngine,
  ) {}

  /**
   * Ingests a new trust signal and triggers reputation recalculation.
   */
  async ingestSignal(
    tenantId: string,
    entityType: string,
    entityId: string,
    signalType: string,
    polarity: "POSITIVE" | "NEGATIVE",
    weight: number = 1.0,
    description?: string,
  ) {
    this.logger.debug(
      `Ingesting ${polarity} trust signal [${signalType}] for [${entityType}:${entityId}] (weight: ${weight})`,
    );

    const signal = await this.prisma.trustSignalEvent.create({
      data: {
        tenantId,
        entityType,
        entityId,
        signalType,
        polarity,
        weight,
        description,
      },
    });

    // In a real implementation, we would update specific dimensions on the profile based on the signalType
    // For now, we simulate by fetching the profile, adjusting a dimension, and recalculating.
    const profile = await this.reputationEngine.getOrCreateProfile(tenantId, entityType, entityId);

    // Naive simulated adjustment for demonstration
    const adjustment = (polarity === "POSITIVE" ? 0.05 : -0.1) * weight;
    const newReliability = Math.max(0.0, Math.min(1.0, profile.deliveryReliability + adjustment));

    await this.prisma.reputationProfile.update({
      where: { id: profile.id },
      data: { deliveryReliability: newReliability },
    });

    await this.reputationEngine.recalculateReputation(tenantId, entityType, entityId);

    return signal;
  }

  /**
   * Retrieves the recent trust signal history for an entity.
   */
  async getSignalHistory(
    tenantId: string,
    entityType: string,
    entityId: string,
    limit: number = 20,
  ) {
    return this.prisma.trustSignalEvent.findMany({
      where: { tenantId, entityType, entityId },
      orderBy: { occurredAt: "desc" },
      take: limit,
    });
  }
}
