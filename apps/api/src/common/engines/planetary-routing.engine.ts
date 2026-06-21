import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PlanetaryRoutingEngine
 *
 * Directs API traffic, background worker tasks, and hyper-automation sagas
 * between massive multi-region edge clusters based on real-time node telemetry.
 */
@Injectable()
export class PlanetaryRoutingEngine {
  private readonly logger = new Logger(PlanetaryRoutingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Discovers the optimal regional edge node for executing a high-priority task.
   */
  async getOptimalRoutingNode(regionCode: string): Promise<string> {
    this.logger.debug(`Searching for optimal planetary routing node in Region [${regionCode}]`);

    const nodes = await this.prisma.planetaryRoutingNode.findMany({
      where: {
        regionCode,
        healthStatus: "HEALTHY",
      },
      orderBy: [{ latencyMs: "asc" }, { activeConnections: "asc" }],
      take: 1,
    });

    if (nodes.length > 0) {
      this.logger.log(
        `Optimal Node Found: [${nodes![0]!.nodeId}] (Latency: ${nodes![0]!.latencyMs}ms)`,
      );
      return nodes![0]!.nodeId;
    }

    this.logger.error(`CRITICAL: No healthy routing nodes available in Region [${regionCode}]!`);
    throw new Error(`Planetary Routing Failure: Region ${regionCode} is isolated or down.`);
  }

  /**
   * Updates the health telemetry of an edge node.
   */
  async updateNodeTelemetry(nodeId: string, latencyMs: number, activeConnections: number) {
    return this.prisma.planetaryRoutingNode.update({
      where: { nodeId },
      data: {
        latencyMs,
        activeConnections,
        lastPingAt: new Date(),
        healthStatus: latencyMs > 2000 ? "DEGRADED" : "HEALTHY",
      },
    });
  }
}
