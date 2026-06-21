import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * BehavioralIntelligenceEngine — "The Workflow Observer" (Phase 9A)
 *
 * Ingests raw telemetry from humans and agents across the ecosystem to detect
 * operational bottlenecks, drop-offs, or inefficient recurring patterns.
 */
@Injectable()
export class BehavioralIntelligenceEngine {
  private readonly logger = new Logger(BehavioralIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a behavioral action to the immutable ledger.
   */
  async recordBehavior(
    tenantId: string,
    workflowId: string,
    actionType: string,
    durationMs: number,
    context: unknown,
  ) {
    this.logger.debug(`Recording behavior [${actionType}] for workflow [${workflowId}]`);

    return this.prisma.behavioralAnalyticsLog.create({
      data: {
        tenantId,
        workflowId,
        actionType,
        durationMs,
        metadata: JSON.stringify(context),
      },
    });
  }

  /**
   * Analyzes recent behavioral logs to detect anomalies or friction points.
   */
  async detectWorkflowFriction(tenantId: string, workflowId: string): Promise<boolean> {
    this.logger.log(`Analyzing workflow friction for [${workflowId}] in Tenant [${tenantId}]`);

    const recentLogs = await this.prisma.behavioralAnalyticsLog.findMany({
      where: { tenantId, workflowId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Heuristic: If more than 20% of recent actions are 'WORKFLOW_ABANDONED', there is severe friction.
    const abandons = recentLogs.filter((log) => log.actionType === "WORKFLOW_ABANDONED").length;

    if (abandons > 20) {
      this.logger.warn(
        `Behavioral Intelligence: High friction detected in workflow [${workflowId}] (${abandons}% abandon rate).`,
      );
      return true;
    }

    return false;
  }
}
