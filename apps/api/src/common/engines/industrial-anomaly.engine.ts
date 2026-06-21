import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialAnomalyEngine — "The Deviation Sensor" (Phase 3H)
 *
 * Scans active autonomous workflows and physical telemetry for deviations
 * from established trust and semantic baselines, generating `IndustrialAnomalyEvent` records.
 */
@Injectable()
export class IndustrialAnomalyEngine {
  private readonly logger = new Logger(IndustrialAnomalyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a detected industrial anomaly.
   */
  async recordAnomaly(
    tenantId: string,
    anomalyType: string,
    context: unknown,
    severity: "WARNING" | "CRITICAL" | "FATAL" = "WARNING",
  ) {
    this.logger.warn(`Anomaly Detected: [${anomalyType}] - Severity: ${severity}`);

    return this.prisma.industrialAnomalyEvent.create({
      data: {
        tenantId,
        anomalyType,
        severity,
        contextJson: JSON.stringify(context),
      },
    });
  }

  /**
   * Retrieves active, unresolved critical anomalies that require immediate governance action.
   */
  async getActiveCriticalAnomalies(tenantId: string) {
    return this.prisma.industrialAnomalyEvent.findMany({
      where: {
        tenantId,
        isResolved: false,
        severity: { in: ["CRITICAL", "FATAL"] },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Marks an anomaly as resolved after human intervention or autonomous correction.
   */
  async resolveAnomaly(anomalyId: string) {
    this.logger.log(`Resolving Anomaly [${anomalyId}]`);

    return this.prisma.industrialAnomalyEvent.update({
      where: { id: anomalyId },
      data: { isResolved: true },
    });
  }
}
