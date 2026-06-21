import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkflowBottleneckAnalyticsEngine — "The Friction Auditor" (Phase 26)
 *
 * Continuously scans process telemetry for slowdowns in human, machine,
 * or hybrid workflows across the enterprise.
 */
@Injectable()
export class WorkflowBottleneckAnalyticsEngine {
  private readonly logger = new Logger(WorkflowBottleneckAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a mathematically detected bottleneck in an enterprise workflow.
   */
  async recordBottleneck(
    tenantId: string,
    workflowId: string,
    node: string,
    frictionScore: number,
    cost: number,
  ) {
    this.logger.log(
      `Recording Workflow Bottleneck in [${workflowId}] at [${node}] - Friction: ${frictionScore}`,
    );

    const bottleneck = await this.prisma.workflowBottleneckAnalytics.create({
      data: {
        tenantId,
        workflowId,
        bottleneckNode: node,
        frictionScore,
        financialImpactEst: cost,
      },
    });

    if (frictionScore > 0.85) {
      this.logger.warn(
        `CRITICAL PROCESS FRICTION: Severe bottleneck detected at node [${node}]. Triggering optimization protocol.`,
      );
    }

    return bottleneck;
  }
}
