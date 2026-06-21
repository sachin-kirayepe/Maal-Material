import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveRecommendationEngine — "The Safe Optimizer" (Phase 9A)
 *
 * Generates actionable, non-breaking operational optimizations for human approval.
 * It will NEVER execute these optimizations autonomously.
 */
@Injectable()
export class AdaptiveRecommendationEngine {
  private readonly logger = new Logger(AdaptiveRecommendationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Suggests an optimization to a tenant based on detected inefficiencies.
   */
  async generateRecommendation(
    tenantId: string,
    domain: string,
    type: string,
    rationalePayload: unknown,
  ) {
    this.logger.log(`Generating [${type}] Recommendation for Tenant [${tenantId}]`);

    return this.prisma.adaptiveRecommendation.create({
      data: {
        tenantId,
        targetDomain: domain,
        recommendationType: type,
        confidenceScore: 0.85, // AI Model confidence score mock
        rationale: JSON.stringify(rationalePayload),
        status: "PENDING_APPROVAL",
      },
    });
  }

  /**
   * Approves a recommendation, marking it safe for execution by the execution engines.
   */
  async approveRecommendation(recommendationId: string): Promise<boolean> {
    this.logger.log(`Approving Recommendation [${recommendationId}]`);

    await this.prisma.adaptiveRecommendation.update({
      where: { id: recommendationId },
      data: { status: "APPROVED" },
    });

    return true;
  }
}
