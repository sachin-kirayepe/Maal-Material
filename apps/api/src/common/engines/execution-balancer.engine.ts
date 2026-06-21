import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionBalancerEngine — "The Load Coordinator" (Phase 3K)
 *
 * Tracks the real-time load distribution across the enterprise
 * execution engines, determining if the meta-orchestrator needs to
 * dynamically redistribute or scale workloads.
 */
@Injectable()
export class ExecutionBalancerEngine {
  private readonly logger = new Logger(ExecutionBalancerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates and updates the load metrics for a specific domain.
   */
  async updateLoadBalancingState(
    tenantId: string,
    domain: string,
    loadMetrics: unknown,
    imbalanceScore: number,
  ) {
    this.logger.debug(`Updating Load Balance State for [${domain}]. Imbalance: ${imbalanceScore}`);

    const existingState = await this.prisma.executionBalancerState.findFirst({
      where: { tenantId, domain },
    });

    if (existingState) {
      return this.prisma.executionBalancerState.update({
        where: { id: existingState.id },
        data: {
          loadMetricsJson: JSON.stringify(loadMetrics),
          imbalanceScore,
          lastChecked: new Date(),
        },
      });
    } else {
      return this.prisma.executionBalancerState.create({
        data: {
          tenantId,
          domain,
          loadMetricsJson: JSON.stringify(loadMetrics),
          imbalanceScore,
        },
      });
    }
  }

  /**
   * Retrieves critical imbalances that require meta-level intervention.
   */
  async getCriticalImbalances(tenantId: string, threshold: number = 0.8) {
    return this.prisma.executionBalancerState.findMany({
      where: {
        tenantId,
        imbalanceScore: { gte: threshold },
      },
    });
  }
}
