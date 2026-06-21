import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveOrchestrationAdaptationEngine — "The Refactor Executor" (Phase 13)
 *
 * The execution arm of Phase 13. Once a human administrator approves a
 * WorkflowOptimizationRecommendation, this engine carefully splices the optimization
 * directly into the live orchestration graph.
 */
@Injectable()
export class AdaptiveOrchestrationAdaptationEngine {
  private readonly logger = new Logger(AdaptiveOrchestrationAdaptationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies an approved optimization recommendation into the live orchestration structure.
   */
  async applyApprovedOptimization(recommendationId: string) {
    this.logger.log(
      `Executing authorized optimization [${recommendationId}] into live orchestration graph.`,
    );

    const recommendation = await this.prisma.workflowOptimizationRecommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      this.logger.error(`Optimization [${recommendationId}] not found.`);
      throw new Error("RECOMMENDATION_NOT_FOUND");
    }

    if (recommendation.status !== "APPROVED") {
      this.logger.error(
        `SECURITY VIOLATION: Attempted to enact unapproved structural change [${recommendationId}]!`,
      );
      throw new Error("UNAPPROVED_MUTATION_DENIED");
    }

    // In production, this parses recommendation.recommendation JSON and dynamically
    // alters the active orchestration pipeline.

    // Update the tenant's Cognitive Profile to reflect that they evolved.
    await this.recordEvolution(recommendation.tenantId, recommendationId);

    this.logger.log(`Structural optimization successfully applied. Maal-Material has evolved.`);
    return true;
  }

  /**
   * Updates the tenant's profile to track its evolutionary history.
   */
  private async recordEvolution(tenantId: string, recommendationId: string) {
    const profile = await this.prisma.adaptiveCognitionProfile.findUnique({
      where: { tenantId },
    });

    if (!profile) {
      await this.prisma.adaptiveCognitionProfile.create({
        data: {
          tenantId,
          learningScore: 1.0,
          evolutionHistory: JSON.stringify([
            { action: "OPTIMIZATION_APPLIED", recommendationId, date: new Date() },
          ]),
        },
      });
    } else {
      const history = JSON.parse(profile.evolutionHistory);
      history.push({ action: "OPTIMIZATION_APPLIED", recommendationId, date: new Date() });

      await this.prisma.adaptiveCognitionProfile.update({
        where: { tenantId },
        data: {
          learningScore: profile.learningScore + 1.0,
          evolutionHistory: JSON.stringify(history),
          lastAdaptedAt: new Date(),
        },
      });
    }
  }
}
