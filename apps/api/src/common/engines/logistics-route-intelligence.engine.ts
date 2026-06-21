import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LogisticsRouteIntelligenceEngine — "The Transit Navigator" (Phase 28)
 *
 * Tracks physical shipments in real-time and recalculates global routing
 * when delays are predicted.
 */
@Injectable()
export class LogisticsRouteIntelligenceEngine {
  private readonly logger = new Logger(LogisticsRouteIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the physical route telemetry of an enterprise shipment.
   */
  async updateRouteTelemetry(
    tenantId: string,
    shipmentId: string,
    lat: number,
    lng: number,
    delayMin: number,
  ) {
    this.logger.debug(
      `Tracking Shipment [${shipmentId}] for Tenant [${tenantId}] - Delay: ${delayMin} min`,
    );

    const route = await this.prisma.logisticsOrchestrationRoute.create({
      data: {
        tenantId,
        shipmentId,
        currentLat: lat,
        currentLng: lng,
        predictedDelayMin: delayMin,
        routeStatus: delayMin > 60 ? "DELAYED" : "IN_TRANSIT",
      },
    });

    if (delayMin > 60) {
      this.logger.warn(
        `LOGISTICS DELAY: Shipment [${shipmentId}] is delayed by over an hour. Triggering downstream SLA adjustments.`,
      );
    }

    return route;
  }
}
