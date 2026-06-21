import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveWorkflowOptimizationEngine — "The Efficiency Architect" (Phase 13)
 *
 * Takes insights from ContinuousLearningEpochs and generates actionable,
 * highly specific WorkflowOptimizationRecommendations for enterprise administrators.
 */
@Injectable()
export class AdaptiveWorkflowOptimizationEngine {
  private readonly logger = new Logger(AdaptiveWorkflowOptimizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new optimization recommendation based on learned patterns.
   */
  async generateOptimizationRecommendation(
    tenantId: string,
    epochId: string,
    workflowId: string,
    changes: unknown,
    projectedSavings: unknown,
  ) {
    this.logger.log(
      `Generating Workflow Optimization Recommendation for Workflow [${workflowId}] in Epoch [${epochId}]`,
    );

    const recommendation = await this.prisma.workflowOptimizationRecommendation.create({
      data: {
        tenantId,
        epochId,
        targetWorkflowId: workflowId,
        recommendation: JSON.stringify(changes),
        projectedSavings: JSON.stringify(projectedSavings),
        status: "PENDING_REVIEW",
      },
    });

    // Notify human administrators that a new high-value efficiency pivot is available for review
    this.logger.debug(
      `Recommendation [${recommendation.id}] staged. Waiting for enterprise human approval.`,
    );
    return recommendation;
  }
}
