import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PhysicalRealityEngine — "The Reality Anchor Manager" (Phase 3L)
 *
 * Manages the lifecycle of `PhysicalRealityAnchor` entities, bridging
 * physical objects (machines, sites, vehicles) to their digital twin counterparts.
 */
@Injectable()
export class PhysicalRealityEngine {
  private readonly logger = new Logger(PhysicalRealityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new physical object into the ecosystem digital twin map.
   */
  async anchorReality(tenantId: string, anchorType: string, externalId: string, metadata: unknown) {
    this.logger.log(`Anchoring Physical Reality: [${anchorType}] ExtID: ${externalId}`);

    return this.prisma.physicalRealityAnchor.create({
      data: {
        tenantId,
        anchorType,
        externalId,
        metadataJson: JSON.stringify(metadata),
        status: "ACTIVE",
      },
    });
  }

  /**
   * Marks a physical anchor as offline, halting its synchronized workflows.
   */
  async severAnchor(anchorId: string) {
    this.logger.warn(`Severing Physical Anchor [${anchorId}]`);

    return this.prisma.physicalRealityAnchor.update({
      where: { id: anchorId },
      data: { status: "OFFLINE" },
    });
  }

  /**
   * Retrieves all active physical anchors for a given environment type.
   */
  async getActiveAnchors(tenantId: string, anchorType: string) {
    return this.prisma.physicalRealityAnchor.findMany({
      where: { tenantId, anchorType, status: "ACTIVE" },
    });
  }
}
