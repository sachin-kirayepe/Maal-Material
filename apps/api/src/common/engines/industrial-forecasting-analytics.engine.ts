import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialForecastingAnalyticsEngine — "The Probability Calculator" (Phase 34)
 *
 * Digests simulation outcomes into concrete, actionable enterprise analytics
 * projecting potential risks and resource shortfalls.
 */
@Injectable()
export class IndustrialForecastingAnalyticsEngine {
  private readonly logger = new Logger(IndustrialForecastingAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates quantitative intelligence based on a predictive simulation.
   */
  async generateForecast(
    tenantId: string,
    scenarioId: string,
    forecastType: string,
    probability: number,
    impact: unknown,
  ) {
    this.logger.debug(
      `Generating Forecast [${forecastType}] for Scenario [${scenarioId}]. Probability: ${(probability * 100).toFixed(1)}%`,
    );

    const forecast = await this.prisma.industrialForecastingAnalytics.create({
      data: {
        tenantId,
        scenarioId,
        forecastType,
        probabilityScore: probability,
        impactPayload: JSON.stringify(impact),
      },
    });

    if (probability > 0.85) {
      this.logger.warn(
        `HIGH PROBABILITY EVENT: System forecasting critical impact in scenario [${scenarioId}]. Alerting Decision Intelligence Layer.`,
      );
    }

    return forecast;
  }
}
