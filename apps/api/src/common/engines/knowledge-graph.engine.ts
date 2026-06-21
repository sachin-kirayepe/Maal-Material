import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * KnowledgeGraphEngine
 *
 * Maintains contextual relationships across the industrial ecosystem.
 * Translates explicit actions (like a completed delivery) into implicit
 * relationships (e.g. VENDOR -> DELIVERS_ON_TIME -> SITE).
 */
@Injectable()
export class KnowledgeGraphEngine {
  private readonly logger = new Logger(KnowledgeGraphEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Upserts a relationship edge in the industrial knowledge graph.
   */
  async recordInferredRelationship(
    tenantId: string,
    sourceType: string,
    sourceId: string,
    relationType: string,
    targetType: string,
    targetId: string,
    confidenceScore: number,
    inferredBy: string,
  ) {
    this.logger.debug(
      `Recording KG Edge: [${sourceType}:${sourceId}] -${relationType}-> [${targetType}:${targetId}]`,
    );

    const edge = await this.prisma.knowledgeGraphEdge.upsert({
      where: {
        unique_edge: {
          tenantId,
          sourceEntityType: sourceType,
          sourceEntityId: sourceId,
          relationType,
          targetEntityType: targetType,
          targetEntityId: targetId,
        },
      },
      update: {
        confidenceScore,
        inferredBy,
        updatedAt: new Date(),
      },
      create: {
        tenantId,
        sourceEntityType: sourceType,
        sourceEntityId: sourceId,
        relationType,
        targetEntityType: targetType,
        targetEntityId: targetId,
        confidenceScore,
        inferredBy,
      },
    });

    return edge;
  }

  /**
   * Queries the knowledge graph for multi-hop insights.
   * Example: Find all assets located at a specific site.
   */
  async findRelatedEntities(
    tenantId: string,
    sourceType: string,
    sourceId: string,
    relationType: string,
  ) {
    return this.prisma.knowledgeGraphEdge.findMany({
      where: {
        tenantId,
        sourceEntityType: sourceType,
        sourceEntityId: sourceId,
        relationType,
        confidenceScore: { gte: 0.5 }, // Only reasonably confident relationships
      },
      orderBy: { confidenceScore: "desc" },
    });
  }
}
