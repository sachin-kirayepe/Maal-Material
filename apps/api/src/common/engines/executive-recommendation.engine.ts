import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutiveRecommendationEngine — "The Advisor" (Phase 16)
 *
 * Synthesizes cross-domain data into clear, actionable strategic choices
 * for human leadership to approve or reject.
 */
@Injectable()
export class ExecutiveRecommendationEngine {
  private readonly logger = new Logger(ExecutiveRecommendationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a synthesized recommendation for the C-suite.
   */
  async proposeRecommendation(
    tenantId: string,
    recommendationType: string,
    contextData: unknown,
    actionPayload: unknown,
  ) {
    this.logger.log(
      `Proposing Executive Recommendation [${recommendationType}] for Tenant [${tenantId}]`,
    );

    const recommendation = await this.prisma.executiveRecommendation.create({
      data: {
        tenantId,
        recommendationType,
        contextData: JSON.stringify(contextData),
        actionPayload: JSON.stringify(actionPayload),
        status: "PENDING",
      },
    });

    return recommendation;
  }
}
