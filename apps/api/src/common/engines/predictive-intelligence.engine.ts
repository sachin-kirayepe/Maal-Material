import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * PredictiveIntelligenceEngine
 *
 * Anomaly detection abstraction that evaluates incoming data streams against
 * configured PredictiveThresholds to generate early-warning intelligence events.
 */
@Injectable()
export class PredictiveIntelligenceEngine {
  private readonly logger = new Logger(PredictiveIntelligenceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates an observed metric against tenant-defined thresholds.
   * If a boundary is breached, it generates an AnomalyEvent.
   */
  async evaluateMetric(params: {
    tenantId: string;
    metricName: string;
    currentValue: number;
    contextDescription: string;
  }) {
    // 1. Fetch active thresholds for this metric
    const thresholds = await this.prisma.predictiveThreshold.findMany({
      where: {
        tenantId: params.tenantId,
        metricName: params.metricName,
        isActive: true,
      },
    });

    for (const threshold of thresholds) {
      let isBreached = false;

      if (threshold.thresholdType === "MIN" && params.currentValue < threshold.thresholdValue) {
        isBreached = true;
      } else if (
        threshold.thresholdType === "MAX" &&
        params.currentValue > threshold.thresholdValue
      ) {
        isBreached = true;
      }

      if (isBreached) {
        this.logger.warn(
          `Threshold breached for ${params.metricName}: ${params.currentValue} (Limit: ${threshold.thresholdType} ${threshold.thresholdValue})`,
        );

        // 2. Generate Anomaly Event
        const anomaly = await this.prisma.anomalyEvent.create({
          data: {
            tenantId: params.tenantId,
            anomalyType: params.metricName,
            severity: threshold.severityLevel,
            description: `Predictive threshold breached: ${params.contextDescription}. Current value is ${params.currentValue}.`,
            evidence: JSON.stringify({
              observedValue: params.currentValue,
              thresholdLimit: threshold.thresholdValue,
              limitType: threshold.thresholdType,
            }),
            status: "DETECTED",
          },
        });

        // 3. Dispatch domain event for downstream UI alerting (e.g., via websockets)
        this.eventDispatcher.dispatch("intelligence", "anomaly_detected", {
          anomalyId: anomaly.id,
          metricName: params.metricName,
          severity: threshold.severityLevel,
        });
      }
    }
  }
}
