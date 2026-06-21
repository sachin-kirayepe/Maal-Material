import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ContinuousSystemOptimizationEngine — "The Hot-Path Profiler" (Phase 6A)
 *
 * Manages ContinuousOptimizationNodes. Profiles execution hot-paths, identifies
 * workflow degradation over time, and flags them for potential evolutionary upgrades.
 */
@Injectable()
export class ContinuousSystemOptimizationEngine {
  private readonly logger = new Logger(ContinuousSystemOptimizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Profiles a live execution path and flags it if optimization is needed.
   */
  async profileExecutionNode(tenantId: string, entityId: string, type: string, latencyMs: number) {
    this.logger.debug(`Profiling Node [Type: ${type}] [Latency: ${latencyMs}ms]`);

    const isSlow = latencyMs > 500; // Example threshold

    return this.prisma.continuousOptimizationNode.create({
      data: {
        tenantId,
        targetEntityId: entityId,
        entityType: type,
        currentLatencyMs: latencyMs,
        isFlaggedForEvolution: isSlow,
      },
    });
  }

  /**
   * Retrieves all flagged nodes ready for meta-cognitive analysis.
   */
  async fetchFlaggedNodes(tenantId: string) {
    this.logger.log(`Fetching flagged optimization nodes for meta-analysis...`);

    return this.prisma.continuousOptimizationNode.findMany({
      where: { tenantId, isFlaggedForEvolution: true },
    });
  }
}
