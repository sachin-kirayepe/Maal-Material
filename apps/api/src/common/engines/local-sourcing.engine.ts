import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GeoOrchestratorEngine } from "./geo-orchestrator.engine";

@Injectable()
export class LocalSourcingEngine {
  private readonly logger = new Logger(LocalSourcingEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geoEngine: GeoOrchestratorEngine,
  ) {}

  /**
   * Finds the nearest workforce candidates for a given project site.
   */
  async findNearbyWorkforce(projectId: string, skillType: string, maxDistanceKm: number = 20) {
    const site = await this.prisma.projectSite.findFirst({
      where: { projectId, siteStatus: "ACTIVE" },
    });

    if (!site || !site.latitude || !site.longitude) {
      this.logger.warn(`Project ${projectId} missing active site or coordinates.`);
      return [];
    }

    // Fast bounding-box pre-filter in DB
    const bounds = this.geoEngine.calculateBoundingBox(
      site.latitude,
      site.longitude,
      maxDistanceKm,
    );

    const candidates = await this.prisma.ecosystemWorkforce.findMany({
      where: {
        skillType,
        isActive: true,
        latitude: { gte: bounds.minLat, lte: bounds.maxLat },
        longitude: { gte: bounds.minLon, lte: bounds.maxLon },
      },
    });

    // Exact Haversine distance sorting in memory
    const sorted = candidates
      .map((worker) => {
        const distance = this.geoEngine.calculateDistanceKm(
          site.latitude!,
          site.longitude!,
          worker.latitude!,
          worker.longitude!,
        );
        return { ...worker, distance };
      })
      .filter((w) => w.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance);

    return sorted;
  }

  /**
   * Finds nearby equipment assets available for rent.
   */
  async findNearbyEquipment(projectId: string, category: string, maxDistanceKm: number = 50) {
    const site = await this.prisma.projectSite.findFirst({
      where: { projectId, siteStatus: "ACTIVE" },
    });

    if (!site || !site.latitude || !site.longitude) {
      return [];
    }

    const bounds = this.geoEngine.calculateBoundingBox(
      site.latitude,
      site.longitude,
      maxDistanceKm,
    );

    const assets = await this.prisma.equipmentAsset.findMany({
      where: {
        category,
        status: "AVAILABLE",
        latitude: { gte: bounds.minLat, lte: bounds.maxLat },
        longitude: { gte: bounds.minLon, lte: bounds.maxLon },
      },
    });

    return assets
      .map((asset) => {
        const distance = this.geoEngine.calculateDistanceKm(
          site.latitude!,
          site.longitude!,
          asset.latitude!,
          asset.longitude!,
        );
        return { ...asset, distance };
      })
      .filter((a) => a.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance);
  }
}
