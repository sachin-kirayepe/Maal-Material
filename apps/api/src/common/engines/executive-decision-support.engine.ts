import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutiveDecisionSupportEngine — "The Strategic Advisor" (Phase 24)
 *
 * Synthesizes millions of rows of financial and operational data into clear,
 * actionable binary choices for human executives.
 */
@Injectable()
export class ExecutiveDecisionSupportEngine {
  private readonly logger = new Logger(ExecutiveDecisionSupportEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a high-level strategic recommendation.
   */
  async proposeDecision(
    tenantId: string,
    summary: string,
    financialImpact: number,
    remediationPlan: unknown,
  ) {
    this.logger.log(`Proposing Executive Decision for Tenant [${tenantId}]: ${summary}`);

    const recommendation = await this.prisma.executiveDecisionRecommendation.create({
      data: {
        tenantId,
        decisionSummary: summary,
        financialImpact,
        operationalImpact: "HIGH",
        remediationPlan: JSON.stringify(remediationPlan),
        decisionStatus: "PENDING_HUMAN_APPROVAL",
      },
    });

    return recommendation;
  }
}
