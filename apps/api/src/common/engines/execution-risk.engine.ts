import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionRiskEngine — "The Predictive Anomaly Detector" (Phase 3U)
 *
 * Ingests cross-tenant data streams to generate ExecutionRiskForecast records,
 * spotting anomalies and friction points before they materialize physically.
 */
@Injectable()
export class ExecutionRiskEngine {
  private readonly logger = new Logger(ExecutionRiskEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Forecasts an impending execution disruption.
   */
  async forecastRisk(
    tenantId: string,
    matrixId: string,
    domain: string,
    probability: number,
    severity: number,
    date: Date,
    context: unknown,
  ) {
    this.logger.warn(
      `Execution Risk Forecasted [Domain: ${domain}] - Probability: ${(probability * 100).toFixed(1)}%`,
    );

    return this.prisma.executionRiskForecast.create({
      data: {
        tenantId,
        matrixId,
        riskDomain: domain,
        probabilityScore: probability,
        impactSeverity: severity,
        predictedDate: date,
        contextJson: JSON.stringify(context),
      },
    });
  }

  /**
   * Retrieves high-probability impending risks requiring mitigation.
   */
  async getImminentRisks(tenantId: string) {
    this.logger.log(`Scanning for imminent, unmitigated execution risks...`);

    const now = new Date();
    const imminentWindow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // Next 14 days

    return this.prisma.executionRiskForecast.findMany({
      where: {
        tenantId,
        probabilityScore: { gte: 0.7 },
        predictedDate: { lte: imminentWindow, gte: now },
      },
      orderBy: { impactSeverity: "desc" },
    });
  }
}
