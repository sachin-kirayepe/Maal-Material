import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedCacheOrchestratorEngine — "The Memory Manager" (Phase 21)
 *
 * Orchestrates L1/L2 caching and aggressive invalidation across the
 * distributed enterprise to prevent stale data reading.
 */
@Injectable()
export class DistributedCacheOrchestratorEngine {
  private readonly logger = new Logger(DistributedCacheOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Invalidates a distributed cache key across all nodes.
   */
  async invalidateCache(tenantId: string, cacheKey: string, invalidationToken: string) {
    this.logger.log(`Invalidating Global Cache Key [${cacheKey}] for Tenant [${tenantId}]`);

    const indexEntry = await this.prisma.globalRuntimeCacheIndex.upsert({
      where: { cacheKey },
      update: {
        invalidationToken,
        lastUpdated: new Date(),
      },
      create: {
        tenantId,
        cacheKey,
        invalidationToken,
      },
    });

    return indexEntry;
  }
}
