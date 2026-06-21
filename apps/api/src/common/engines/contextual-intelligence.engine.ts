import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ContextualIntelligenceEngine — "The Copilot Context Engine" (Phase 5A)
 *
 * Manages ContextualIntelligenceNodes. It calculates real-time operational context
 * (who is working, what are they doing) to generate highly relevant insights.
 */
@Injectable()
export class ContextualIntelligenceEngine {
  private readonly logger = new Logger(ContextualIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a contextual insight for an active workflow.
   */
  async draftContextualInsight(
    tenantId: string,
    workflowId: string,
    insightJson: unknown,
    relevance: number,
  ) {
    this.logger.debug(
      `Drafting Contextual Insight [Workflow: ${workflowId}] [Relevance: ${relevance}]`,
    );

    return this.prisma.contextualIntelligenceNode.create({
      data: {
        tenantId,
        workflowContextId: workflowId,
        localizedInsightJson: JSON.stringify(insightJson),
        relevanceScore: relevance,
        isActive: true,
      },
    });
  }

  /**
   * Retrieves highly relevant contextual insights for a specific active workflow.
   */
  async fetchWorkflowInsights(tenantId: string, workflowId: string, minRelevance: number = 0.85) {
    this.logger.log(`Scanning for contextual insights for workflow ${workflowId}...`);

    const nodes = await this.prisma.contextualIntelligenceNode.findMany({
      where: {
        tenantId,
        workflowContextId: workflowId,
        isActive: true,
        relevanceScore: { gte: minRelevance },
      },
      orderBy: { relevanceScore: "desc" },
    });

    if (nodes.length > 0) {
      this.logger.log(`Found ${nodes.length} relevant AI insights for current context.`);
    }

    return nodes.map((node) => ({
      ...node,
      localizedInsightJson: JSON.parse(node.localizedInsightJson),
    }));
  }
}
