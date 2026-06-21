import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveBehavioralTelemetryEngine — "The Behavioral Ingestion Node" (Phase 26)
 *
 * Safely and anonymously collects continuous efficiency data from
 * the workforce to power the Organizational Digital Twin.
 */
@Injectable()
export class AdaptiveBehavioralTelemetryEngine {
  private readonly logger = new Logger(AdaptiveBehavioralTelemetryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ingests a continuous stream of behavioral telemetry.
   */
  async ingestTelemetry(tenantId: string, source: string, metric: number, isAnomaly: boolean) {
    // We do not log deeply here to avoid overwhelming the logger with high-throughput streams.

    const telemetry = await this.prisma.adaptiveBehavioralTelemetry.create({
      data: {
        tenantId,
        telemetrySource: source,
        efficiencyMetric: metric,
        anomalyDetected: isAnomaly,
      },
    });

    if (isAnomaly) {
      this.logger.debug(`Behavioral Anomaly Ingested for Tenant [${tenantId}] from [${source}]`);
    }

    return telemetry;
  }
}
