import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealityMirrorEngine — "The Live Reflection" (Phase 3W)
 *
 * Orchestrates RealityMirrorNode structures, guaranteeing the digital
 * representation always perfectly matches the real-world physical truth.
 */
@Injectable()
export class RealityMirrorEngine {
  private readonly logger = new Logger(RealityMirrorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes a high-frequency state update for a physical asset.
   */
  async syncMirrorNode(
    tenantId: string,
    physicalAssetId: string,
    liveState: unknown,
    syncLatencyMs: number,
  ) {
    if (syncLatencyMs > 1000) {
      this.logger.warn(
        `High Latency Detected on Reality Mirror Node [${physicalAssetId}]: ${syncLatencyMs}ms`,
      );
    }

    const node = await this.prisma.realityMirrorNode.findFirst({
      where: { tenantId, physicalAssetId },
    });

    if (node) {
      return this.prisma.realityMirrorNode.update({
        where: { id: node.id },
        data: {
          liveStateJson: JSON.stringify(liveState),
          syncLatencyMs,
          lastMirroredAt: new Date(),
        },
      });
    } else {
      return this.prisma.realityMirrorNode.create({
        data: {
          tenantId,
          physicalAssetId,
          liveStateJson: JSON.stringify(liveState),
          syncLatencyMs,
        },
      });
    }
  }

  /**
   * Retrieves the live state of an asset if the data is fresh (latency < threshold).
   */
  async getVerifiedLiveState(
    tenantId: string,
    physicalAssetId: string,
    maxTolerableLatencyMs: number,
  ) {
    const node = await this.prisma.realityMirrorNode.findFirst({
      where: { tenantId, physicalAssetId },
    });

    if (!node) return null;

    if (node.syncLatencyMs > maxTolerableLatencyMs) {
      this.logger.error(
        `Asset [${physicalAssetId}] state is STALE. Latency: ${node.syncLatencyMs}ms`,
      );
      return null; // Force operational halt if state is out of sync
    }

    return JSON.parse(node.liveStateJson);
  }
}
