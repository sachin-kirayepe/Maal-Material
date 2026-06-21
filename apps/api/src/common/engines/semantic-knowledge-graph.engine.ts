import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SemanticKnowledgeGraphEngine — "The Ontology Fabric" (Phase 3G)
 *
 * Manages the lifecycle of Industrial Knowledge Nodes and Edges.
 * Allows for mapping and querying of complex semantic dependencies across the industrial ecosystem.
 */
@Injectable()
export class SemanticKnowledgeGraphEngine {
  private readonly logger = new Logger(SemanticKnowledgeGraphEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new semantic node in the industrial knowledge graph.
   */
  async registerNode(
    tenantId: string,
    nodeType: string,
    nodeLabel: string,
    properties: unknown,
    confidenceScore: number = 1.0,
  ) {
    this.logger.debug(`Registering Knowledge Node: [${nodeType}] ${nodeLabel}`);

    return this.prisma.industrialKnowledgeNode.create({
      data: {
        tenantId,
        nodeType,
        nodeLabel,
        propertiesJson: JSON.stringify(properties),
        confidenceScore,
      },
    });
  }

  /**
   * Establishes a deterministic semantic relationship between two nodes.
   */
  async establishRelationship(
    tenantId: string,
    sourceNodeId: string,
    targetNodeId: string,
    relationshipType: string,
    weight: number = 1.0,
  ) {
    this.logger.debug(
      `Establishing Relationship: [${sourceNodeId}] --(${relationshipType})--> [${targetNodeId}]`,
    );

    return this.prisma.industrialKnowledgeEdge.create({
      data: {
        tenantId,
        sourceNodeId,
        targetNodeId,
        relationshipType,
        weight,
      },
    });
  }

  /**
   * Recursively traverses downstream dependencies for a given node.
   * e.g., Finding all projects impacted by a "Steel Grade 50" shortage.
   */
  async traverseDependencies(
    tenantId: string,
    startNodeId: string,
    relationshipType: string,
  ): Promise<any[]> {
    // In a true graph DB, this would be a recursive query.
    // Here we stub the traversal capability for the relational model.
    this.logger.log(
      `Traversing knowledge graph from Node [${startNodeId}] via relation [${relationshipType}]`,
    );

    const edges = await this.prisma.industrialKnowledgeEdge.findMany({
      where: {
        tenantId,
        sourceNodeId: startNodeId,
        relationshipType,
      },
      include: {
        targetNode: true,
      },
    });

    return edges.map((e) => e.targetNode);
  }
}
