import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseKnowledgeGraphEngine — "The Entity Mapper" (Phase 29)
 *
 * Constructs and maintains the live organizational knowledge graph, linking
 * physical machines, human workers, and digital software services.
 */
@Injectable()
export class EnterpriseKnowledgeGraphEngine {
  private readonly logger = new Logger(EnterpriseKnowledgeGraphEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a semantic relationship edge between two nodes in the enterprise.
   */
  async registerEdge(sourceId: string, targetId: string, relationType: string, weight: number) {
    this.logger.debug(
      `Registering Knowledge Graph Edge: [${sourceId}] --(${relationType})--> [${targetId}] (Weight: ${weight})`,
    );

    const edge = await this.prisma.enterpriseKnowledgeGraphEdge.create({
      data: {
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        relationType,
        dependencyWeight: weight,
      },
    });

    if (weight > 0.9) {
      this.logger.warn(
        `CRITICAL DEPENDENCY LOGGED: [${sourceId}] heavily depends on [${targetId}]. Node ${targetId} is now a high-risk failure point.`,
      );
    }

    return edge;
  }
}
