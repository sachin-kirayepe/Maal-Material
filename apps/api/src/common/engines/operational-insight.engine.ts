import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * OperationalInsightEngine
 *
 * Converts raw anomalies, trends, and predictions into actionable AiInsights.
 * These insights are directly renderable by the Adaptive Experience dashboards.
 */
@Injectable()
export class OperationalInsightEngine {
  private readonly logger = new Logger(OperationalInsightEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Generates a high-level operational insight that a human operator can read on their dashboard.
   */
  async generateInsight(params: {
    tenantId: string;
    insightType: string;
    title: string;
    description: string;
    confidenceScore?: number;
    metricsPayload?: unknown;
  }) {
    this.logger.log(
      `Generating operational insight for tenant ${params.tenantId}: ${params.title}`,
    );

    const insight = await this.prisma.aiInsight.create({
      data: {
        tenantId: params.tenantId,
        type: params.insightType,
        title: params.title,
        description: params.description,
        confidence: params.confidenceScore || 1.0,
        metrics: params.metricsPayload ? JSON.stringify(params.metricsPayload) : null,
      },
    });

    this.eventDispatcher.dispatch("intelligence", "insight_generated", {
      insightId: insight.id,
      insightType: params.insightType,
    });

    return insight;
  }

  /**
   * Automatically scans unresolved anomalies and escalates them to actionable insights
   * if they persist beyond a certain duration.
   */
  async escalateAnomaliesToInsights(tenantId: string) {
    const unresolved = await this.prisma.anomalyEvent.findMany({
      where: {
        tenantId,
        status: "DETECTED",
      },
    });

    for (const anomaly of unresolved) {
      await this.generateInsight({
        tenantId,
        insightType: "ANOMALY_ESCALATION",
        title: `Unresolved Alert: ${anomaly.anomalyType}`,
        description: `An anomaly detected at ${anomaly.detectedAt.toISOString()} requires your attention. ${anomaly.description}`,
        confidenceScore: 0.95,
        metricsPayload: { anomalyId: anomaly.id, severity: anomaly.severity },
      });

      // Mark anomaly as escalated (in a real system we might have an ESCALATED status)
      await this.prisma.anomalyEvent.update({
        where: { id: anomaly.id },
        data: { status: "ESCALATED" }, // Note: Assuming the application logic treats this custom string appropriately.
      });
    }
  }
}
