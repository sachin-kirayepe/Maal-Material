import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalTrustEngine — "The Dynamic Reputation Fabric" (Phase 3H)
 *
 * Manages `OperationalTrustProfile` scores. Continuously adapts the trust rating of
 * entities (suppliers, algorithms, workflows) based on successful executions and anomalies.
 */
@Injectable()
export class OperationalTrustEngine {
  private readonly logger = new Logger(OperationalTrustEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adjusts the operational trust score for an entity based on recent events.
   */
  async updateTrustScore(tenantId: string, entityId: string, entityType: string, delta: number) {
    this.logger.log(`Adjusting Trust Score for [${entityType}] ${entityId} by ${delta}`);

    const existing = await this.prisma.operationalTrustProfile.findUnique({
      where: {
        tenantId_entityId_entityType: { tenantId, entityId, entityType },
      },
    });

    if (existing) {
      let newScore = existing!.trustScore + delta;
      newScore = Math.max(0.0, Math.min(1.0, newScore)); // Clamp between 0.0 and 1.0

      return this.prisma.operationalTrustProfile.update({
        where: { id: existing!.id },
        data: {
          trustScore: newScore,
          lastUpdated: new Date(),
        },
      });
    }

    // Default starting trust is 0.50
    let initialScore = 0.5 + delta;
    initialScore = Math.max(0.0, Math.min(1.0, initialScore));

    return this.prisma.operationalTrustProfile.create({
      data: {
        tenantId,
        entityId,
        entityType,
        trustScore: initialScore,
      },
    });
  }

  /**
   * Retrieves the trust profile of an entity. If below a critical threshold, it may be isolated.
   */
  async getTrustProfile(tenantId: string, entityId: string, entityType: string) {
    return this.prisma.operationalTrustProfile.findUnique({
      where: {
        tenantId_entityId_entityType: { tenantId, entityId, entityType },
      },
    });
  }
}
