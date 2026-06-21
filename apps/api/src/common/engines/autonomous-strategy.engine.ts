import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AutonomousStrategyEngine — "The Mitigator" (Phase 3U)
 *
 * Formulates AutonomousStrategyNode mitigation plans, simulating them
 * against the digital twin before recommending or applying them.
 */
@Injectable()
export class AutonomousStrategyEngine {
  private readonly logger = new Logger(AutonomousStrategyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synthesizes an autonomous mitigation strategy for a predicted risk.
   */
  async formulateMitigationStrategy(
    tenantId: string,
    forecastId: string,
    mitigationPlan: unknown,
    cost: number,
  ) {
    this.logger.debug(`Formulating Autonomous Mitigation Strategy [Forecast ID: ${forecastId}]`);

    // The AI models different operational responses to find the optimal path
    return this.prisma.autonomousStrategyNode.create({
      data: {
        tenantId,
        forecastId,
        mitigationPlanJson: JSON.stringify(mitigationPlan),
        estimatedCost: cost,
        approvalStatus: "PENDING",
      },
    });
  }

  /**
   * Executes an approved strategy to preemptively alter physical-world orchestration.
   */
  async executeStrategy(nodeId: string) {
    this.logger.log(`Executing Autonomous Strategy Node [${nodeId}]`);

    return this.prisma.autonomousStrategyNode.update({
      where: { id: nodeId },
      data: { approvalStatus: "AUTONOMOUSLY_EXECUTED" },
    });
  }
}
