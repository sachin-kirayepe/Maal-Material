import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketOptimizationEngine — "The Dynamic Pricer" (Phase 7B)
 *
 * Manages MarketOptimizationNodes. Calculates best supply/demand curves
 * and real-time pricing vectors based on active telemetry.
 */
@Injectable()
export class MarketOptimizationEngine {
  private readonly logger = new Logger(MarketOptimizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies a dynamic pricing or optimization vector to a specific physical asset or fleet.
   */
  async applyMarketOptimization(
    tenantId: string,
    assetId: string,
    domain: string,
    optimizationVectorJson: unknown,
    predictedYield: number,
  ) {
    this.logger.debug(
      `Applying Market Optimization [Asset: ${assetId}] [Domain: ${domain}] [Yield: +${predictedYield}%]`,
    );

    return this.prisma.marketOptimizationNode.create({
      data: {
        tenantId,
        targetAssetId: assetId,
        marketDomain: domain,
        currentOptimizationVectorJson: JSON.stringify(optimizationVectorJson),
        projectedYieldIncrease: predictedYield,
      },
    });
  }
}
