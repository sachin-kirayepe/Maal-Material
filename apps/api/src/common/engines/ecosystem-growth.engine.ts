import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemGrowthEngine — "The Economic Velocity Tracker" (Phase 3E)
 *
 * Tracks the compounded economic health, velocity, and growth trajectories of contractors
 * and suppliers within the federation. Calculates macro risk exposure.
 */
@Injectable()
export class EcosystemGrowthEngine {
  private readonly logger = new Logger(EcosystemGrowthEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a new economic intelligence snapshot for a specific ecosystem entity.
   */
  async trackGrowth(
    tenantId: string,
    targetEntityId: string,
    entityType: "SUPPLIER" | "CONTRACTOR" | "REGION",
    growthScore: number,
    velocity: number,
    riskExposure: number,
    metrics: unknown,
  ) {
    this.logger.log(
      `Tracking Ecosystem Growth for ${entityType} [${targetEntityId}] - Score: ${growthScore}, Velocity: ${velocity}`,
    );

    return this.prisma.ecosystemGrowthIntelligence.create({
      data: {
        tenantId,
        targetEntityId,
        entityType,
        growthScore,
        velocity,
        riskExposure,
        metricsJson: JSON.stringify(metrics),
      },
    });
  }

  /**
   * Identifies hyper-growth entities that are rapidly expanding within the ecosystem.
   */
  async getHyperGrowthEntities(tenantId: string, minVelocity: number = 2.0) {
    const recentMetrics = await this.prisma.ecosystemGrowthIntelligence.findMany({
      where: {
        tenantId,
        velocity: { gte: minVelocity },
      },
      orderBy: { calculatedAt: "desc" },
      take: 50,
    });

    // Deduplicate by entity ID (returning only the latest hyper-growth record per entity)
    const uniqueMap = new Map<string, any>();
    for (const metric of recentMetrics) {
      if (!uniqueMap.has(metric.targetEntityId)) {
        uniqueMap.set(metric.targetEntityId, metric);
      }
    }

    const hyperGrowth = Array.from(uniqueMap.values());
    this.logger.debug(`Found ${hyperGrowth.length} hyper-growth entities for tenant ${tenantId}.`);
    return hyperGrowth;
  }
}
