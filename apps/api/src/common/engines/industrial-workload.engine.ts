import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialWorkloadEngine — "The Pressure Valve" (Phase 3X)
 *
 * Monitors systemic workflow pressure and triggers IndustrialWorkloadBalancer
 * shifts to maintain operational fluidity and prevent catastrophic bottlenecks.
 */
@Injectable()
export class IndustrialWorkloadEngine {
  private readonly logger = new Logger(IndustrialWorkloadEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Triggers a load-balancing shift of execution pressure from one node to another.
   */
  async shiftExecutionWorkload(
    tenantId: string,
    sourceNodeId: string,
    targetNodeId: string,
    amount: number,
    reason: string,
  ) {
    this.logger.warn(
      `Shifting Workload Pressure [${sourceNodeId} -> ${targetNodeId}] Amount: ${amount} | Reason: ${reason}`,
    );

    return this.prisma.industrialWorkloadBalancer.create({
      data: {
        tenantId,
        sourceNodeId,
        targetNodeId,
        workloadShifted: amount,
        shiftReason: reason,
      },
    });
  }

  /**
   * Identifies execution nodes that are approaching critical failure/congestion limits.
   */
  async detectCriticalPressureNodes(tenantId: string) {
    // In a real system, this queries live telemetry and correlates with active shifts
    this.logger.debug(`Scanning ecosystem for critical workload pressure nodes...`);

    const shifts = await this.prisma.industrialWorkloadBalancer.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return shifts;
  }
}
