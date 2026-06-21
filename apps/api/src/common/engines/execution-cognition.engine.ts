import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionCognitionEngine — "The Reality Optimizer" (Phase 10)
 *
 * Scans the live ExecutionStateGraph to detect real-world anomalies (bottlenecks)
 * and generates advisory optimization logs requiring human approval.
 */
@Injectable()
export class ExecutionCognitionEngine {
  private readonly logger = new Logger(ExecutionCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synthesizes an execution anomaly into a safe, human-reviewed recommendation.
   */
  async logOptimizationOpportunity(
    tenantId: string,
    anomaly: string,
    recommendation: string,
    confidence: number,
  ) {
    this.logger.log(`Execution Cognition triggered for [${tenantId}]. Anomaly: [${anomaly}]`);

    // We never actuate physical state directly. We stage it for the Command Center.
    return this.prisma.executionCognitionLog.create({
      data: {
        tenantId,
        detectedAnomaly: anomaly,
        recommendedAction: recommendation,
        confidenceScore: confidence,
        executionStatus: "PENDING_HUMAN_APPROVAL",
      },
    });
  }

  /**
   * Called by the Command Center operator to authorize the physical pivot.
   */
  async authorizeOptimization(cognitionLogId: string, authorizerId: string): Promise<boolean> {
    this.logger.log(
      `Human Operator [${authorizerId}] authorized Execution Cognition Log [${cognitionLogId}]`,
    );

    const log = await this.prisma.executionCognitionLog.findUnique({
      where: { id: cognitionLogId },
    });

    if (!log || log.executionStatus !== "PENDING_HUMAN_APPROVAL") {
      this.logger.warn(`Cognition Log [${cognitionLogId}] is no longer actionable.`);
      return false;
    }

    // Mark approved. Another system (e.g. WorkforceSynchronizationEngine) would pick this up to dispatch.
    await this.prisma.executionCognitionLog.update({
      where: { id: cognitionLogId },
      data: { executionStatus: "APPROVED_AND_ROUTING" },
    });

    return true;
  }
}
