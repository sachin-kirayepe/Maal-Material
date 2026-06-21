import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalForecastingEngine — "The Oracle" (Phase 16)
 *
 * Analyzes historical graphs and ecosystem telemetry to predict future
 * operational states and bottlenecks.
 */
@Injectable()
export class OperationalForecastingEngine {
  private readonly logger = new Logger(OperationalForecastingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new operational forecast.
   */
  async generateForecast(
    tenantId: string,
    forecastType: string,
    predictionData: unknown,
    confidenceScore: number,
    targetDate: Date,
  ) {
    this.logger.log(
      `Generating Operational Forecast [${forecastType}] for Tenant [${tenantId}] with confidence: ${confidenceScore}%`,
    );

    const forecast = await this.prisma.operationalForecast.create({
      data: {
        tenantId,
        forecastType,
        predictionData: JSON.stringify(predictionData),
        confidenceScore,
        targetDate,
      },
    });

    return forecast;
  }
}
