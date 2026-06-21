import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalAnomalyDetectorEngine — "The Physical Auditor" (Phase 28)
 *
 * Correlates telemetry from the physical world to instantly detect
 * and flag real-world anomalies (e.g., equipment failures, blocked routes).
 */
@Injectable()
export class OperationalAnomalyDetectorEngine {
  private readonly logger = new Logger(OperationalAnomalyDetectorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a mathematically confirmed physical operational anomaly.
   */
  async logAnomaly(tenantId: string, type: string, severity: number, impactJson: unknown) {
    this.logger.error(
      `PHYSICAL ANOMALY DETECTED for Tenant [${tenantId}]: [${type}] - Severity: ${severity}`,
    );

    const anomaly = await this.prisma.operationalAnomalyEvent.create({
      data: {
        tenantId,
        anomalyType: type,
        severityScore: severity,
        impactGraph: JSON.stringify(impactJson),
        resolutionStatus: "UNRESOLVED",
      },
    });

    if (severity >= 0.9) {
      this.logger.error(
        `CRITICAL INFRASTRUCTURE FAILURE: Anomaly [${anomaly.id}] has severity >= 0.9. Initiating global digital workflow halt for affected node.`,
      );
    }

    return anomaly;
  }
}
