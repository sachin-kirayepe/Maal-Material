import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedCognitionNodeEngine — "The Edge Synapse" (Phase 20)
 *
 * Handles edge-node coordination, allowing remote environments (ships, mines)
 * to process decisions locally but act globally when connectivity is restored.
 */
@Injectable()
export class DistributedCognitionNodeEngine {
  private readonly logger = new Logger(DistributedCognitionNodeEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates an edge cognition node.
   */
  async pulseNode(
    tenantId: string,
    edgeNodeId: string,
    localCacheState: unknown,
    isConnected: boolean,
  ) {
    this.logger.log(
      `Pulsing Edge Cognition Node [${edgeNodeId}] (Connected: ${isConnected}) for Tenant [${tenantId}]`,
    );

    const nodeEntry = await this.prisma.distributedCognitionNode.upsert({
      where: { edgeNodeId },
      update: {
        localCacheState: JSON.stringify(localCacheState),
        isConnected,
        lastSyncTime: new Date(),
      },
      create: {
        tenantId,
        edgeNodeId,
        localCacheState: JSON.stringify(localCacheState),
        isConnected,
      },
    });

    return nodeEntry;
  }
}
