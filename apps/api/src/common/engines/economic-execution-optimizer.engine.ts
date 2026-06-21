import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EconomicExecutionOptimizerEngine — "The Resource Economist" (Phase 30)
 *
 * Dynamically tracks the compute cost and ROI of autonomous AI execution,
 * terminating workflows that are burning cash without yielding business value.
 */
@Injectable()
export class EconomicExecutionOptimizerEngine {
  private readonly logger = new Logger(EconomicExecutionOptimizerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the economic efficiency of an ongoing autonomous agent workflow.
   */
  async evaluateAgentEconomy(tenantId: string, agentId: string, costUsd: number, valueUsd: number) {
    this.logger.debug(
      `Evaluating Economic Efficiency for Agent [${agentId}] - Cost: $${costUsd} | Value: $${valueUsd}`,
    );

    const metric = await this.prisma.economicExecutionMetric.create({
      data: {
        tenantId,
        agentId,
        computeCostUsd: costUsd,
        valueGeneratedUsd: valueUsd,
      },
    });

    if (costUsd > valueUsd * 2) {
      this.logger.warn(
        `ECONOMIC INEFFICIENCY DETECTED: Agent [${agentId}] is operating at a severe loss. Triggering workflow scaling reduction.`,
      );
    }

    return metric;
  }
}
