import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SystemicAnomalyCognitionEngine — "The Observer" (Phase 19)
 *
 * Scans millions of global events for macroscopic inefficiencies, latency spikes,
 * or supply drops that trigger the formulation of new hypotheses.
 */
@Injectable()
export class SystemicAnomalyCognitionEngine {
  private readonly logger = new Logger(SystemicAnomalyCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a systemic anomaly detected in the orchestration network.
   */
  async registerAnomaly(
    tenantId: string,
    anomalyType: string,
    telemetryData: unknown,
    severity: string = "MEDIUM",
  ) {
    this.logger.warn(
      `Registering Systemic Anomaly [${anomalyType}] with Severity [${severity}] in Tenant [${tenantId}]`,
    );

    const anomaly = await this.prisma.systemicAnomalyDetection.create({
      data: {
        tenantId,
        anomalyType,
        telemetryData: JSON.stringify(telemetryData),
        severity,
        resolved: false,
      },
    });

    return anomaly;
  }
}
