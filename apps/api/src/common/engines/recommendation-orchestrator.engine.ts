import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GeoOrchestratorEngine } from "./geo-orchestrator.engine";
import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * RecommendationOrchestratorEngine
 *
 * An abstract decision pipeline that aggregates multiple signals (geographic proximity,
 * entity capabilities, past ratings) to generate AI-ready CommerceRecommendations.
 */
@Injectable()
export class RecommendationOrchestratorEngine {
  private readonly logger = new Logger(RecommendationOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geoEngine: GeoOrchestratorEngine,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Generates a recommendation to source materials/services from a supplier for a specific project.
   */
  async recommendSupplierForProject(params: {
    tenantId: string;
    projectId: string;
    categoryId: string;
    maxDistanceKm: number;
    minRating?: number;
  }) {
    this.logger.debug(`Generating supplier recommendations for project ${params.projectId}`);

    const site = await this.prisma.projectSite.findFirst({
      where: { projectId: params.projectId, siteStatus: "ACTIVE" },
    });

    if (!site || !site.latitude || !site.longitude) {
      this.logger.warn(`Project ${params.projectId} has no valid site coordinates.`);
      return [];
    }

    const bounds = this.geoEngine.calculateBoundingBox(
      site.latitude,
      site.longitude,
      params.maxDistanceKm,
    );

    // Initial query: Supplier addresses within bounds that carry the specific category
    const nearbyAddresses = await this.prisma.supplierAddress.findMany({
      where: {
        latitude: { gte: bounds.minLat, lte: bounds.maxLat },
        longitude: { gte: bounds.minLon, lte: bounds.maxLon },
        suppliers: {
          rating: { gte: params.minRating || 0 },
        },
      },
      include: { suppliers: true },
    });

    const recommendations = [];

    // Refine and score
    for (const address of nearbyAddresses) {
      const distance = this.geoEngine.calculateDistanceKm(
        site.latitude,
        site.longitude,
        address.latitude!,
        address.longitude!,
      );

      if (distance <= params.maxDistanceKm) {
        // Base confidence derived from distance (closer is better, normalized to 0.0 - 0.5)
        const distanceScore = Math.max(0, 0.5 - (distance / params.maxDistanceKm) * 0.5);

        // Rating score (higher rating is better, normalized to 0.0 - 0.5)
        const ratingScore = (address.suppliers.rating / 5) * 0.5;

        const totalScore = parseFloat((distanceScore + ratingScore).toFixed(2));

        const rationale = `Found supplier ${distance.toFixed(1)}km away with a rating of ${address.suppliers.rating}.`;

        const recommendation = await this.prisma.commerceRecommendation.create({
          data: {
            tenantId: params.tenantId,
            contextType: "PROJECT_SITE",
            contextId: site.id,
            targetEntityType: "COMMERCE_PARTICIPANT",
            targetEntityId: address.supplierId,
            confidenceScore: totalScore,
            rationale,
            status: "SUGGESTED",
          },
        });

        recommendations.push(recommendation);

        this.eventDispatcher.dispatch("intelligence", "recommendation_generated", {
          recommendationId: recommendation.id,
          contextType: "PROJECT_SITE",
          targetEntityType: "COMMERCE_PARTICIPANT",
        });
      }
    }

    // Return sorted by highest confidence score
    return recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
}
