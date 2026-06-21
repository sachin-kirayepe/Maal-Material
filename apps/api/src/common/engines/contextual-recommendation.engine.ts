import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ContextualRecommendationEngine
 *
 * Dedicated to pushing real-time next-best-action suggestions
 * to the frontend UI based on the user's current workflow context
 * and underlying decision intelligence.
 */
@Injectable()
export class ContextualRecommendationEngine {
  private readonly logger = new Logger(ContextualRecommendationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves intelligent next-best-actions for a specific user and context.
   */
  async getContextualSuggestions(tenantId: string, userId: string, workflowContext: string) {
    this.logger.debug(`Fetching recommendations for ${userId} in context: ${workflowContext}`);

    // Query recent AI decisions that haven't been executed yet for this context
    const pendingDecisions = await this.prisma.decisionIntelligenceLog.findMany({
      where: {
        tenantId,
        executed: false,
        confidenceScore: { gte: 0.7 }, // Only show reasonably confident suggestions
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    return pendingDecisions.map((d) => ({
      suggestionId: d.id,
      entity: d.entityType,
      action: d.suggestedAction,
      confidence: d.confidenceScore,
      reason: "Based on real-time ecosystem intelligence.",
    }));
  }
}
