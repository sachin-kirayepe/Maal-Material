import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ArchitectureHealthEngine — "The System Diagnostician" (Phase 3S)
 *
 * Ingests and analyzes ArchitectureHealthMetric telemetry to detect
 * degraded execution flows or engine latencies before they cause disruption.
 */
@Injectable()
export class ArchitectureHealthEngine {
  private readonly logger = new Logger(ArchitectureHealthEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a snapshot of internal architectural telemetry.
   */
  async recordHealthMetric(
    tenantId: string,
    coreId: string,
    domain: string,
    score: number,
    data: unknown,
  ) {
    this.logger.debug(`Recording Architecture Health Metric [${domain}] Score: ${score}`);

    return this.prisma.architectureHealthMetric.create({
      data: {
        tenantId,
        coreId,
        metricDomain: domain,
        healthScore: score,
        telemetryDataJson: JSON.stringify(data),
      },
    });
  }

  /**
   * Analyzes current system health across all metric domains.
   */
  async analyzeSystemHealth(tenantId: string, coreId: string) {
    this.logger.log(`Analyzing Platform Architectural Health for Core: ${coreId}`);

    const criticalMetrics = await this.prisma.architectureHealthMetric.findMany({
      where: { tenantId, coreId, healthScore: { lt: 0.5 } },
      orderBy: { recordedAt: "desc" },
      take: 10,
    });

    if (criticalMetrics.length > 0) {
      this.logger.error(
        `DETECTED ${criticalMetrics.length} DEGRADED ARCHITECTURE METRICS. Internal Diagnostics triggered.`,
      );
    }

    return criticalMetrics;
  }
}
