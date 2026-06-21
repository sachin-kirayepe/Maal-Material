import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PredictiveForecastEngine
 *
 * Ingests and serves ML-driven operational forecasts. These forecasts allow the platform
 * to act preemptively (e.g., ordering inventory before a predicted stockout).
 */
@Injectable()
export class PredictiveForecastEngine {
  private readonly logger = new Logger(PredictiveForecastEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new predictive forecast for a specific operational metric.
   */
  async registerForecast(
    tenantId: string,
    metricName: string,
    forecastData: unknown,
    confidenceScore: number,
    targetEntityId?: string,
  ) {
    this.logger.debug(
      `Registering Predictive Forecast for [${metricName}]. Confidence: ${confidenceScore}`,
    );

    const forecast = await this.prisma.predictiveOperationalForecast.create({
      data: {
        tenantId,
        metricName,
        targetEntityId,
        forecastValues: JSON.stringify(forecastData),
        confidenceScore,
      },
    });

    // High-confidence forecasts might trigger a Hyper-Automation Saga or Strategic Matrix evaluation here
    if (confidenceScore > 0.85) {
      this.logger.log(`High confidence forecast generated. Emitting predictive alert event.`);
      // Event emission logic
    }

    return forecast;
  }

  /**
   * Retrieves the latest forecast for a metric.
   */
  async getLatestForecast(tenantId: string, metricName: string) {
    return this.prisma.predictiveOperationalForecast.findFirst({
      where: { tenantId, metricName },
      orderBy: { generatedAt: "desc" },
    });
  }
}
