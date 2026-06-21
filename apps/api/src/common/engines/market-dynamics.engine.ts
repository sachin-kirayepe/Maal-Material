import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketDynamicsEngine — "The Market Observer" (Phase 3P)
 *
 * Ingests external macro-economic data streams and maintains
 * an up-to-date representation of industrial market conditions.
 */
@Injectable()
export class MarketDynamicsEngine {
  private readonly logger = new Logger(MarketDynamicsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global cognition model for a specific market sector.
   */
  async updateMarketCognition(
    tenantId: string,
    marketSector: string,
    volatility: number,
    pricingTrend: unknown,
  ) {
    this.logger.log(`Updating Market Cognition for [${marketSector}] | Volatility: ${volatility}`);

    const existingModel = await this.prisma.globalMarketCognitionModel.findFirst({
      where: { tenantId, marketSector },
    });

    if (existingModel) {
      return this.prisma.globalMarketCognitionModel.update({
        where: { id: existingModel.id },
        data: {
          volatilityIndex: volatility,
          pricingTrendJson: JSON.stringify(pricingTrend),
        },
      });
    } else {
      return this.prisma.globalMarketCognitionModel.create({
        data: {
          tenantId,
          marketSector,
          volatilityIndex: volatility,
          pricingTrendJson: JSON.stringify(pricingTrend),
        },
      });
    }
  }

  /**
   * Retrieves the latest market intelligence for strategic decision-making.
   */
  async getMarketSnapshot(tenantId: string, marketSector: string) {
    return this.prisma.globalMarketCognitionModel.findFirst({
      where: { tenantId, marketSector },
    });
  }
}
