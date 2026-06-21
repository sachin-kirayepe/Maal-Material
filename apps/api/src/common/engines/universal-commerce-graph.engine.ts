import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { KnowledgeGraphEngine } from "./knowledge-graph.engine";
import { UniversalEntityEngine } from "./universal-entity.engine";

/**
 * UniversalCommerceGraphEngine
 *
 * Sits above the raw Knowledge Graph to provide industry-agnostic
 * ecosystem insights. For example, it can answer: "Show me the
 * highest rated entities connected to this project, regardless of
 * whether they are healthcare suppliers or construction contractors."
 */
@Injectable()
export class UniversalCommerceGraphEngine {
  private readonly logger = new Logger(UniversalCommerceGraphEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kgEngine: KnowledgeGraphEngine,
    private readonly entityEngine: UniversalEntityEngine,
  ) {}

  /**
   * Explores the commerce graph for a specific universal entity,
   * retrieving its first-degree connections mapped to actual Universal Entities.
   */
  async getEcosystemConnections(tenantId: string, sourceEntityId: string) {
    this.logger.debug(`Traversing Universal Commerce Graph for entity: ${sourceEntityId}`);

    // Query raw graph edges
    const edges = await this.prisma.knowledgeGraphEdge.findMany({
      where: { tenantId, sourceEntityId },
      orderBy: { confidenceScore: "desc" },
      take: 20,
    });

    if (edges.length === 0) return [];

    const targetIds = edges.map((e) => e.targetEntityId);

    // Hydrate edges with the UniversalCommerceEntity dynamic attributes
    const targets = await this.prisma.universalCommerceEntity.findMany({
      where: { id: { in: targetIds } },
    });

    return edges.map((edge) => {
      const targetEntity = targets.find((t) => t.id === edge.targetEntityId);
      return {
        relation: edge.relationType,
        confidence: edge.confidenceScore,
        target: targetEntity ? JSON.parse(targetEntity.attributesJson) : null,
      };
    });
  }
}
