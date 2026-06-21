import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemCredibilityEngine — "The Network Health Monitor"
 *
 * Generates periodic ecosystem-wide credibility indices and surfaces
 * systemic trust risks (e.g., tier distribution across suppliers).
 */
@Injectable()
export class EcosystemCredibilityEngine {
  private readonly logger = new Logger(EcosystemCredibilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a credibility index snapshot for a specific entity type (e.g., SUPPLIER).
   */
  async generateCredibilitySnapshot(tenantId: string, entityType: string) {
    this.logger.log(`Generating Ecosystem Credibility Snapshot for [${entityType}]`);

    const profiles = await this.prisma.reputationProfile.findMany({
      where: { tenantId, entityType },
    });

    if (profiles.length === 0) {
      this.logger.warn(`No profiles found for ${entityType}, cannot generate snapshot.`);
      return null;
    }

    let totalScore = 0;
    const tierCounts: Record<string, number> = {};

    for (const p of profiles) {
      totalScore += p.overallReputation;
      tierCounts[p.currentTier] = (tierCounts[p.currentTier] || 0) + 1;
    }

    const aggregateScore = totalScore / profiles.length;

    return this.prisma.ecosystemCredibilityIndex.create({
      data: {
        tenantId,
        indexType: `${entityType}_RELIABILITY`,
        aggregateScore,
        entityCount: profiles.length,
        tierDistribution: JSON.stringify(tierCounts),
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        periodEnd: new Date(),
      },
    });
  }

  /**
   * Compares the latest credibility index to a previous one to identify systemic trust drift.
   */
  async analyzeCredibilityDrift(tenantId: string, indexType: string) {
    const snapshots = await this.prisma.ecosystemCredibilityIndex.findMany({
      where: { tenantId, indexType },
      orderBy: { generatedAt: "desc" },
      take: 2,
    });

    if (snapshots.length < 2) return { status: "INSUFFICIENT_DATA" };

    const [current, previous] = snapshots;
    const drift = current!.aggregateScore - previous!.aggregateScore;

    this.logger.log(
      `Credibility Drift for [${indexType}]: ${drift > 0 ? "+" : ""}${drift.toFixed(3)}`,
    );

    return {
      currentScore: current!.aggregateScore,
      previousScore: previous!.aggregateScore,
      drift,
      trend: drift >= 0 ? "IMPROVING" : "DEGRADING",
    };
  }
}
