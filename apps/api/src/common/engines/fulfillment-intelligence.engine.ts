import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GeoOrchestratorEngine } from "./geo-orchestrator.engine";

@Injectable()
export class FulfillmentIntelligenceEngine {
  private readonly logger = new Logger(FulfillmentIntelligenceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geoEngine: GeoOrchestratorEngine,
  ) {}

  /**
   * Determines if a specific warehouse can fulfill an order to a destination site
   * based on distance and the warehouse's service radius.
   */
  async canFulfillFromWarehouse(
    warehouseId: string,
    destLat: number,
    destLon: number,
  ): Promise<boolean> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || !warehouse.latitude || !warehouse.longitude || !warehouse.serviceRadiusKm) {
      return false;
    }

    return this.geoEngine.isWithinRadius(
      warehouse.latitude,
      warehouse.longitude,
      destLat,
      destLon,
      warehouse.serviceRadiusKm,
    );
  }

  /**
   * Finds the best supplier address (closest) that can fulfill a specific product
   * based on their service areas.
   */
  async findOptimalFulfillmentSupplier(participantId: string, destLat: number, destLon: number) {
    // Check if the participant has explicit ServiceAreas defined
    const serviceAreas = await this.prisma.serviceArea.findMany({
      where: { participantId, isActive: true },
    });

    for (const area of serviceAreas) {
      if (area.type === "RADIUS" && area.centerLatitude && area.centerLongitude && area.radiusKm) {
        const canServe = this.geoEngine.isWithinRadius(
          area.centerLatitude,
          area.centerLongitude,
          destLat,
          destLon,
          area.radiusKm,
        );
        if (canServe) return { method: "SERVICE_AREA", area };
      }
      // Future: Add GEOHASH and POLYGON intersection logic here
    }

    // Fallback: Check supplier's registered addresses and their serviceRadiusKm
    const addresses = await this.prisma.supplierAddress.findMany({
      where: { supplierId: participantId },
    });

    for (const address of addresses) {
      if (address.latitude && address.longitude && address.serviceRadiusKm) {
        const canServe = this.geoEngine.isWithinRadius(
          address.latitude,
          address.longitude,
          destLat,
          destLon,
          address.serviceRadiusKm,
        );
        if (canServe) {
          const distance = this.geoEngine.calculateDistanceKm(
            address.latitude,
            address.longitude,
            destLat,
            destLon,
          );
          return { method: "ADDRESS_RADIUS", address, distanceKm: distance };
        }
      }
    }

    return null;
  }
}
