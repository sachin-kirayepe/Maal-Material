import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionBrainEngine — "The Macro Orchestrator" (Phase 3X)
 *
 * Orchestrates the ExecutionBrainCore, optimizing macro-level execution
 * capacity and dynamically balancing operational load across the ecosystem.
 */
@Injectable()
export class ExecutionBrainEngine {
  private readonly logger = new Logger(ExecutionBrainEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes the active execution workload distribution for a tenant!.
   */
  async syncExecutionCapacity(
    tenantId: string,
    totalCapacity: number,
    workloadDistribution: unknown,
  ) {
    this.logger.log(`Synchronizing Execution Brain Capacity for Tenant: ${tenantId}`);

    const core = await this.prisma.executionBrainCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.executionBrainCore.update({
        where: { id: core.id },
        data: {
          totalExecutionCapacity: totalCapacity,
          activeWorkloadJson: JSON.stringify(workloadDistribution),
          lastOptimizedAt: new Date(),
        },
      });
    } else {
      return this.prisma.executionBrainCore.create({
        data: {
          tenantId,
          totalExecutionCapacity: totalCapacity,
          activeWorkloadJson: JSON.stringify(workloadDistribution),
        },
      });
    }
  }

  /**
   * Checks if the enterprise has enough available bandwidth to take on a major new operation.
   */
  async evaluateCapacity(tenantId: string, requiredBandwidth: number): Promise<boolean> {
    const core = await this.prisma.executionBrainCore.findFirst({
      where: { tenantId },
    });

    if (!core) return false;

    // A real implementation would parse `activeWorkloadJson` to find specific local availability
    const isAvailable = core.totalExecutionCapacity > requiredBandwidth;

    if (!isAvailable) {
      this.logger.warn(`Execution Capacity EXCEEDED for tenant ${tenantId}.`);
    }

    return isAvailable;
  }
}
