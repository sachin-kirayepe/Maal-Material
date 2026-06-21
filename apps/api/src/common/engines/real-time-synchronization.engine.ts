import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealTimeSynchronizationEngine — "The Telemetry Stream" (Phase 6C)
 *
 * Manages RealTimeSynchronizationNodes. Ensures continuous, fault-tolerant telemetry
 * ingestion from the physical world into the virtual environment.
 */
@Injectable()
export class RealTimeSynchronizationEngine {
  private readonly logger = new Logger(RealTimeSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a real-time heartbeat from a physical asset.
   */
  async processAssetHeartbeat(tenantId: string, assetId: string, latencyMs: number) {
    this.logger.debug(
      `Processing Telemetry Heartbeat [Asset: ${assetId}] [Latency: ${latencyMs}ms]`,
    );

    const node = await this.prisma.realTimeSynchronizationNode.findFirst({
      where: { tenantId, physicalAssetId: assetId },
    });

    if (node) {
      return this.prisma.realTimeSynchronizationNode.update({
        where: { id: node.id },
        data: {
          telemetryStreamLatencyMs: latencyMs,
          isActivelyStreaming: true,
          lastHeartbeatAt: new Date(),
        },
      });
    } else {
      return this.prisma.realTimeSynchronizationNode.create({
        data: {
          tenantId,
          physicalAssetId: assetId,
          telemetryStreamLatencyMs: latencyMs,
          isActivelyStreaming: true,
        },
      });
    }
  }

  /**
   * Detects "dead" or disconnected physical assets (stale telemetry).
   */
  async flagDisconnectedAssets(tenantId: string, staleThresholdMs: number = 30000) {
    const cutoff = new Date(Date.now() - staleThresholdMs);

    this.logger.warn(`Flagging disconnected assets (No heartbeat since ${cutoff.toISOString()})`);

    return this.prisma.realTimeSynchronizationNode.updateMany({
      where: {
        tenantId,
        isActivelyStreaming: true,
        lastHeartbeatAt: { lt: cutoff },
      },
      data: {
        isActivelyStreaming: false,
      },
    });
  }
}
