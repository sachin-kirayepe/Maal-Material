import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FutureAwareDecisionIntelligenceEngine — "The Strategic Executive" (Phase 34)
 *
 * Analyzes simulation forecasts and pre-authorizes the highest-probability
 * path for real-world execution.
 */
@Injectable()
export class FutureAwareDecisionIntelligenceEngine {
  private readonly logger = new Logger(FutureAwareDecisionIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Commits a decision based on predictive analytics.
   */
  async executeFutureAwareDecision(
    tenantId: string,
    scenarioId: string,
    actionType: string,
    confidence: number,
  ) {
    this.logger.log(
      `Strategic Execution: Action [${actionType}] elected based on Scenario [${scenarioId}]. Confidence: ${(confidence * 100).toFixed(1)}%`,
    );

    // Only auto-execute if the mathematical confidence is exceptionally high
    const isAutoExecuted = confidence >= 0.98;

    const decision = await this.prisma.futureAwareOperationalDecision.create({
      data: {
        tenantId,
        scenarioId,
        actionType,
        confidenceLevel: confidence,
        isAutoExecuted,
      },
    });

    if (isAutoExecuted) {
      this.logger.debug(
        `Confidence threshold met. Action [${actionType}] bypassed human approval and was autonomously executed in the physical world.`,
      );
    } else {
      this.logger.debug(
        `Action [${actionType}] queued for human executive review. Confidence [${confidence}] did not meet 0.98 threshold.`,
      );
    }

    return decision;
  }
}
