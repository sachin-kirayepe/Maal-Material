import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicDemandEngine — "The Oracle" (Phase 3M)
 *
 * Forecasts future industrial demands by analyzing historical trends,
 * market signals, and predictive data. Maintains the `StrategicDemandForecast`.
 */
@Injectable()
export class StrategicDemandEngine {
  private readonly logger = new Logger(StrategicDemandEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates or updates a strategic demand forecast for a specific domain.
   */
  async forecastDemand(
    tenantId: string,
    forecastDomain: string,
    forecastData: unknown,
    confidenceScore: number,
    targetDate: Date,
  ) {
    this.logger.log(
      `Forecasting Demand for [${forecastDomain}] at target date: ${targetDate.toISOString()}`,
    );

    return this.prisma.strategicDemandForecast.create({
      data: {
        tenantId,
        forecastDomain,
        forecastJson: JSON.stringify(forecastData),
        confidenceScore,
        targetDate,
      },
    });
  }

  /**
   * Retrieves high-confidence forecasts approaching their target dates.
   */
  async getImminentForecasts(tenantId: string, thresholdDate: Date, minConfidence: number = 0.8) {
    return this.prisma.strategicDemandForecast.findMany({
      where: {
        tenantId,
        targetDate: { lte: thresholdDate },
        confidenceScore: { gte: minConfidence },
      },
      orderBy: { targetDate: "asc" },
    });
  }
}
