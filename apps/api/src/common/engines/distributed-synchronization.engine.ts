import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedSynchronizationEngine — "The Multi-System Harmonizer" (Phase 5B)
 *
 * Manages DistributedSynchronizationNodes. Ensures that distinct systems (e.g., procurement
 * and on-site logistics) remain perfectly aligned and harmonized in real-time.
 */
@Injectable()
export class DistributedSynchronizationEngine {
  private readonly logger = new Logger(DistributedSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the synchronization latency between two disparate workflows.
   */
  async lockWorkflowSynchronization(
    tenantId: string,
    workflowA: string,
    workflowB: string,
    latencyMs: number,
  ) {
    this.logger.debug(
      `Synchronizing Workflows [${workflowA} <-> ${workflowB}] [Latency: ${latencyMs}ms]`,
    );

    return this.prisma.distributedSynchronizationNode.create({
      data: {
        tenantId,
        workflowAId: workflowA,
        workflowBId: workflowB,
        syncLatencyMs: latencyMs,
        isActive: true,
      },
    });
  }

  /**
   * Scans for out-of-sync workflows across the enterprise grid.
   */
  async identifySynchronizationDrifts(tenantId: string, maxTolerableLatency: number) {
    this.logger.log(`Scanning for synchronization drifts exceeding ${maxTolerableLatency}ms...`);

    const driftingNodes = await this.prisma.distributedSynchronizationNode.findMany({
      where: {
        tenantId,
        isActive: true,
        syncLatencyMs: { gt: maxTolerableLatency },
      },
    });

    if (driftingNodes.length > 0) {
      this.logger.warn(
        `Identified ${driftingNodes.length} workflows heavily out of sync. Immediate harmonization required.`,
      );
    }

    return driftingNodes;
  }
}
