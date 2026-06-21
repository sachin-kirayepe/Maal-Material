import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DemandForecastingEngine — "The Predictive Supply Matrix" (Phase 3E)
 *
 * Forecasts future demand and supply trajectories for specific categories (materials, labor)
 * in defined geographic regions. It provides mathematical visibility into upcoming shortages
 * before they impact enterprise workflows.
 */
@Injectable()
export class DemandForecastingEngine {
  private readonly logger = new Logger(DemandForecastingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new regional demand forecast for a specific category.
   */
  async generateForecast(
    regionCode: string,
    category: string,
    forecastDate: Date,
    predictedDemand: number,
    predictedSupply: number,
    confidence: number,
    tenantId?: string,
  ) {
    this.logger.log(
      `Generating Demand Forecast for [${category}] in [${regionCode}] for Date: ${forecastDate.toISOString()} (Confidence: ${confidence})`,
    );

    // Supersede any older active forecast for this exact region/category/date
    await this.prisma.regionalDemandForecast.updateMany({
      where: {
        regionCode,
        category,
        forecastDate,
        status: "ACTIVE",
        tenantId,
      },
      data: { status: "SUPERSEDED" },
    });

    return this.prisma.regionalDemandForecast.create({
      data: {
        tenantId,
        regionCode,
        category,
        forecastDate,
        predictedDemand,
        predictedSupply,
        confidence,
        status: "ACTIVE",
      },
    });
  }

  /**
   * Identifies impending shortfalls (where predicted demand vastly outstrips supply).
   */
  async getImpendingShortfalls(
    regionCode: string,
    lookaheadDays: number = 30,
    deficitThreshold: number = 0.2,
  ) {
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + lookaheadDays);

    const forecasts = await this.prisma.regionalDemandForecast.findMany({
      where: {
        regionCode,
        forecastDate: { lte: horizon },
        status: "ACTIVE",
      },
    });

    // Filter forecasts where (demand - supply) / supply > deficitThreshold
    const shortfalls = forecasts.filter((f) => {
      if (f.predictedSupply <= 0) return true;
      const deficitRatio = (f.predictedDemand - f.predictedSupply) / f.predictedSupply;
      return deficitRatio > deficitThreshold;
    });

    if (shortfalls.length > 0) {
      this.logger.warn(
        `Identified ${shortfalls.length} impending shortfalls in [${regionCode}] within ${lookaheadDays} days.`,
      );
    }

    return shortfalls;
  }
}
