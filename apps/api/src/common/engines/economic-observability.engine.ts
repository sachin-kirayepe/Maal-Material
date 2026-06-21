import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EconomicObservabilityEngine
 *
 * Provides macroeconomic analytics across the entire platform ecosystem.
 * Useful for platform administrators to detect industry-wide liquidity
 * crunches (e.g. "Payment delays in the Logistics sector are up 15% this month").
 */
@Injectable()
export class EconomicObservabilityEngine {
  private readonly logger = new Logger(EconomicObservabilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregates and logs an economic health metric for a specific industry category.
   */
  async trackEcosystemMetric(industryCategory: string, metricType: string, metricValue: number) {
    this.logger.debug(
      `Tracking Macroeconomic Metric: [${industryCategory}] ${metricType} = ${metricValue}`,
    );

    return this.prisma.economicEcosystemMetric.create({
      data: {
        industryCategory,
        metricType,
        metricValue,
      },
    });
  }

  /**
   * Retrieves economic health trends for a specific sector.
   */
  async getIndustryHealth(industryCategory: string) {
    this.logger.log(`Generating Economic Health Report for Industry: ${industryCategory}`);

    const metrics = await this.prisma.economicEcosystemMetric.findMany({
      where: { industryCategory },
      orderBy: { recordedAt: "desc" },
      take: 100,
    });

    return {
      industryCategory,
      totalDataPoints: metrics.length,
      latestMetrics: metrics.slice(0, 5),
    };
  }
}
