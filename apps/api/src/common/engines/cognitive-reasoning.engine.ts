import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CognitiveReasoningEngine — "The Causal Linker" (Phase 6B)
 *
 * Synchronizes CognitiveReasoningEdges. Maps contextual dependencies, establishing
 * *why* things happen to provide deep causal reasoning for systemic events.
 */
@Injectable()
export class CognitiveReasoningEngine {
  private readonly logger = new Logger(CognitiveReasoningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Establishes a causal reasoning edge between two distinct enterprise entities.
   */
  async mapCausalRelationship(
    tenantId: string,
    sourceId: string,
    targetId: string,
    type: string,
    reasoningVector: unknown,
  ) {
    this.logger.debug(`Mapping Causal Edge [${sourceId}] --(${type})--> [${targetId}]`);

    return this.prisma.cognitiveReasoningEdge.create({
      data: {
        tenantId,
        sourceEntityId: sourceId,
        targetEntityId: targetId,
        causalRelationshipType: type,
        reasoningVectorJson: JSON.stringify(reasoningVector),
      },
    });
  }

  /**
   * Retrieves all upstream causal dependencies for a given entity to reason about systemic failure.
   */
  async analyzeCausalDependencies(tenantId: string, targetEntityId: string) {
    this.logger.log(`Analyzing upstream causal reasoning for entity: ${targetEntityId}`);

    return this.prisma.cognitiveReasoningEdge.findMany({
      where: { tenantId, targetEntityId },
    });
  }
}
