import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialWorkforceCognitionEngine — "The Human-AI Coordinator" (Phase 24)
 *
 * Ensures safe and efficient operational collaboration between human
 * factory workers and the global AI autonomous systems.
 */
@Injectable()
export class IndustrialWorkforceCognitionEngine {
  private readonly logger = new Logger(IndustrialWorkforceCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a real-time operational cognition insight for the workforce.
   */
  async generateWorkforceInsight(
    tenantId: string,
    summary: string,
    telemetryData: unknown,
    severity: string = "INFO",
  ) {
    this.logger.debug(
      `Generating Workforce Cognition Insight for Tenant [${tenantId}]: ${summary}`,
    );

    const insight = await this.prisma.operationalCognitionInsight.create({
      data: {
        tenantId,
        insightType: "PREDICTIVE_MAINTENANCE",
        insightSummary: summary,
        supportingData: JSON.stringify(telemetryData),
        severity,
      },
    });

    return insight;
  }
}
