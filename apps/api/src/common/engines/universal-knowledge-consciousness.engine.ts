import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalKnowledgeConsciousnessEngine — "The Semantic Brain" (Phase 6B)
 *
 * Orchestrates the KnowledgeConsciousnessMatrix. Synthesizes cross-domain
 * enterprise data to build the platform's active semantic worldview.
 */
@Injectable()
export class UniversalKnowledgeConsciousnessEngine {
  private readonly logger = new Logger(UniversalKnowledgeConsciousnessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the overall cognitive confidence and semantic node count of the enterprise grid.
   */
  async updateSemanticConsciousness(
    tenantId: string,
    nodeCount: number,
    cognitiveConfidence: number,
  ) {
    this.logger.log(
      `Updating Knowledge Consciousness [Nodes: ${nodeCount}] [Confidence: ${cognitiveConfidence}]`,
    );

    const matrix = await this.prisma.knowledgeConsciousnessMatrix.findFirst({
      where: { tenantId },
    });

    if (matrix) {
      return this.prisma.knowledgeConsciousnessMatrix.update({
        where: { id: matrix.id },
        data: {
          totalSemanticNodes: matrix.totalSemanticNodes + nodeCount,
          systemicCognitiveConfidence: cognitiveConfidence,
          lastSynthesisAppliedAt: new Date(),
        },
      });
    } else {
      return this.prisma.knowledgeConsciousnessMatrix.create({
        data: {
          tenantId,
          totalSemanticNodes: nodeCount,
          systemicCognitiveConfidence: cognitiveConfidence,
        },
      });
    }
  }

  /**
   * Retrieves the current cognitive state of the enterprise.
   */
  async getConsciousnessMatrix(tenantId: string) {
    return this.prisma.knowledgeConsciousnessMatrix.findFirst({
      where: { tenantId },
    });
  }
}
