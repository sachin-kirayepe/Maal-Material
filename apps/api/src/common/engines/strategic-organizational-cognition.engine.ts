import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicOrganizationalCognitionEngine — "The Synergy Analyst" (Phase 26)
 *
 * Detects isolated teams, communication silos, and cross-functional
 * synergy opportunities across the global organization.
 */
@Injectable()
export class StrategicOrganizationalCognitionEngine {
  private readonly logger = new Logger(StrategicOrganizationalCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a high-level organizational cognition insight.
   */
  async deriveInsight(
    tenantId: string,
    type: string,
    summary: string,
    graph: unknown,
    score: number,
  ) {
    this.logger.debug(`Deriving Organizational Insight [${type}] for Tenant [${tenantId}]`);

    const cognition = await this.prisma.strategicOrganizationalCognition.create({
      data: {
        tenantId,
        cognitionType: type,
        insightSummary: summary,
        evidenceGraph: JSON.stringify(graph),
        actionabilityScore: score,
      },
    });

    return cognition;
  }
}
