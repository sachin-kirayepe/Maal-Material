import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SemanticRelationshipEngine — "The Relationship Mapper"
 *
 * Creates, queries, and decays weighted semantic relationships between ecosystem entities.
 * Enables queries like "find all suppliers connected to this project with confidence > 0.8."
 */
@Injectable()
export class SemanticRelationshipEngine {
  private readonly logger = new Logger(SemanticRelationshipEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates or strengthens a weighted semantic relationship between two entities.
   */
  async linkEntities(
    tenantId: string,
    sourceEntityType: string,
    sourceEntityId: string,
    targetEntityType: string,
    targetEntityId: string,
    relationshipType: string,
    weight: number = 1.0,
    confidence: number = 1.0,
    metadata?: unknown,
  ) {
    this.logger.debug(
      `Linking [${sourceEntityType}:${sourceEntityId}] —(${relationshipType})→ [${targetEntityType}:${targetEntityId}] ` +
        `(weight: ${weight}, confidence: ${confidence})`,
    );

    return this.prisma.semanticRelationshipEdge.create({
      data: {
        tenantId,
        sourceEntityType,
        sourceEntityId,
        targetEntityType,
        targetEntityId,
        relationshipType,
        weight,
        confidence,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }

  /**
   * Queries all outbound relationships from a specific entity, optionally filtered by type and minimum confidence.
   */
  async getRelationshipsFrom(
    tenantId: string,
    entityType: string,
    entityId: string,
    minConfidence: number = 0.0,
    relationshipType?: string,
  ) {
    return this.prisma.semanticRelationshipEdge.findMany({
      where: {
        tenantId,
        sourceEntityType: entityType,
        sourceEntityId: entityId,
        confidence: { gte: minConfidence },
        ...(relationshipType ? { relationshipType } : {}),
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
      orderBy: { weight: "desc" },
    });
  }

  /**
   * Applies temporal decay to stale relationships, reducing their weight over time.
   */
  async decayStaleRelationships(tenantId: string, decayFactor: number = 0.95) {
    this.logger.debug(
      `Applying relationship decay (factor: ${decayFactor}) for Tenant [${tenantId}]`,
    );

    const staleEdges = await this.prisma.semanticRelationshipEdge.findMany({
      where: { tenantId, validUntil: null },
    });

    let decayed = 0;
    for (const edge of staleEdges) {
      const newWeight = edge.weight * decayFactor;
      if (newWeight < 0.01) continue; // Skip near-zero relationships
      await this.prisma.semanticRelationshipEdge.update({
        where: { id: edge.id },
        data: { weight: newWeight },
      });
      decayed++;
    }

    this.logger.log(`Decayed ${decayed} relationships for Tenant [${tenantId}].`);
    return decayed;
  }
}
