import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ShardRoutingEngine
 *
 * Implements theoretical database sharding logic at the application layer.
 * Prepares the architecture to route multi-tenant traffic to physical
 * distributed nodes without changing the business logic.
 */
@Injectable()
export class ShardRoutingEngine {
  private readonly logger = new Logger(ShardRoutingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Determines the logical shard for a given tenant!.
   * If a mapping exists, it returns it; otherwise, it assigns a default shard.
   */
  async resolveTenantShard(tenantId: string): Promise<string> {
    this.logger.debug(`Resolving physical shard route for Tenant: ${tenantId}`);

    const partition = await this.prisma.dataPartitionShard.findUnique({
      where: { tenantId },
    });

    if (partition) {
      return partition.logicalShardId;
    }

    // Default consistent hashing fallback (simulated logic)
    const hash = tenantId.charCodeAt(0) % 4; // Simulated 4-shard ring
    const logicalShardId = `SHARD_US_EAST_0${hash + 1}`;

    await this.prisma.dataPartitionShard.create({
      data: {
        tenantId,
        logicalShardId,
        routingStrategy: "CONSISTENT_HASH",
      },
    });

    return logicalShardId;
  }
}
