import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionCoordinationEngine — "The Global Conductor" (Phase 5B)
 *
 * Orchestrates the ExecutionCoordinationCore. Acts as the global conductor of
 * enterprise execution, monitoring throughput and resolving systemic bottlenecks.
 */
@Injectable()
export class ExecutionCoordinationEngine {
  private readonly logger = new Logger(ExecutionCoordinationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global coordination state and overall execution throughput efficiency.
   */
  async updateExecutionThroughput(
    tenantId: string,
    synchronizedWorkflows: number,
    efficiencyIndex: number,
  ) {
    this.logger.log(
      `Updating Execution Coordination [Harmonized Workflows: ${synchronizedWorkflows}, Efficiency: ${efficiencyIndex}]`,
    );

    const core = await this.prisma.executionCoordinationCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.executionCoordinationCore.update({
        where: { id: core.id },
        data: {
          totalWorkflowsSynchronized: synchronizedWorkflows,
          enterpriseOrchestrationHealth: efficiencyIndex,
          lastOptimizedAt: new Date(),
        },
      });
    } else {
      return this.prisma.executionCoordinationCore.create({
        data: {
          tenantId,
          totalWorkflowsSynchronized: synchronizedWorkflows,
          enterpriseOrchestrationHealth: efficiencyIndex,
        },
      });
    }
  }

  /**
   * Evaluates if the enterprise execution grid is healthy enough to handle systemic surges.
   */
  async checkGridStability(tenantId: string): Promise<boolean> {
    const core = await this.prisma.executionCoordinationCore.findFirst({
      where: { tenantId },
    });

    if (!core || core.enterpriseOrchestrationHealth < 0.8) {
      this.logger.warn(
        `Execution Coordination Grid is unstable (Efficiency: ${core?.enterpriseOrchestrationHealth || 0}). Throttle systemic load.`,
      );
      return false;
    }

    return true;
  }
}
