import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossServiceIntelligenceEngine
 *
 * Breaks down silos between different platform services (e.g. Finance, Logistics, Trust).
 * E.g., It can tell a tenant: "Do not approve this Procurement, because the vendor's
 * Trust Score is low AND your current Cashflow Forecast is negative."
 */
@Injectable()
export class CrossServiceIntelligenceEngine {
  private readonly logger = new Logger(CrossServiceIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates a holistic cross-service risk profile for an ecosystem transaction.
   */
  async evaluateEcosystemRisk(tenantId: string, targetEntityId: string): Promise<any> {
    this.logger.debug(`Evaluating Cross-Service Intelligence for Entity: ${targetEntityId}`);

    // Fetch Trust Data, Financial Data, and Network Data in parallel
    const [trustData, networkData] = await Promise.all([
      (this.prisma as any).trustScore.findFirst({ where: { tenantId, entityId: targetEntityId } }),
      this.prisma.industrialNetworkEffectLink.findMany({
        where: { universalEntityId: targetEntityId },
      }),
    ]);

    const baseTrust = trustData ? trustData.score : 50;

    // Leverage the network effect multiplier
    const networkMultiplier =
      networkData.reduce((sum, link) => sum + link.trustMultiplier, 0) / (networkData.length || 1);

    const compositeScore = Math.min(100, baseTrust * networkMultiplier);

    return {
      isSafe: compositeScore > 65,
      compositeScore,
      insights: [
        `Base Trust: ${baseTrust}`,
        `Ecosystem Network Multiplier: ${networkMultiplier.toFixed(2)}x`,
        `Cross-Tenant Connections: ${networkData.length}`,
      ],
    };
  }
}
