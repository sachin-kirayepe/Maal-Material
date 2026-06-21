import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalSuperfabricEngine — "The Connective Tissue" (Phase 3Z)
 *
 * Maintains the dynamic topology of the GlobalOperatingSuperfabric, ensuring
 * structural integrity and connectivity across millions of distributed industrial nodes.
 */
@Injectable()
export class GlobalSuperfabricEngine {
  private readonly logger = new Logger(GlobalSuperfabricEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a node's topological state within the global superfabric.
   */
  async pulseSuperfabricNode(tenantId: string, nodeId: string, topologyState: unknown) {
    this.logger.debug(`Pulsing Superfabric Node [${nodeId}]`);

    const node = await this.prisma.globalOperatingSuperfabric.findFirst({
      where: { tenantId, nodeId },
    });

    if (node) {
      return this.prisma.globalOperatingSuperfabric.update({
        where: { id: node.id },
        data: {
          globalTopologyStateJson: JSON.stringify(topologyState),
          lastPulseAt: new Date(),
        },
      });
    } else {
      return this.prisma.globalOperatingSuperfabric.create({
        data: {
          tenantId,
          nodeId,
          globalTopologyStateJson: JSON.stringify(topologyState),
        },
      });
    }
  }

  /**
   * Detects "dark nodes" that have disconnected from the global fabric.
   */
  async detectFabricTears(tenantId: string, staleThresholdMs: number = 30000) {
    this.logger.log(`Scanning Global Superfabric for disconnected nodes (Tears)...`);

    const staleDate = new Date(Date.now() - staleThresholdMs);

    const staleNodes = await this.prisma.globalOperatingSuperfabric.findMany({
      where: {
        tenantId,
        lastPulseAt: { lt: staleDate },
      },
    });

    if (staleNodes.length > 0) {
      this.logger.error(
        `CRITICAL: Detected ${staleNodes.length} nodes disconnected from the Global Superfabric!`,
      );
    }

    return staleNodes;
  }
}
