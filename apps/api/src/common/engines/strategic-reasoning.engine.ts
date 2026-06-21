import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicReasoningEngine — "The Causal Simulator" (Phase 4B)
 *
 * Manages StrategicReasoningNodes, calculating multiple causal pathways
 * and mathematically evaluating the risk/reward ratio of potential corporate strategies.
 */
@Injectable()
export class StrategicReasoningEngine {
  private readonly logger = new Logger(StrategicReasoningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new reasoning node to solve a complex strategic challenge.
   */
  async initializeReasoningNode(
    tenantId: string,
    challengeId: string,
    pathways: unknown[],
    riskRewardRatio: number,
  ) {
    this.logger.debug(
      `Initializing Strategic Reasoning [Challenge: ${challengeId}] [Risk/Reward: ${riskRewardRatio}]`,
    );

    return this.prisma.strategicReasoningNode.create({
      data: {
        tenantId,
        strategicChallengeId: challengeId,
        causalPathwaysJson: JSON.stringify(pathways),
        riskRewardRatio,
        isActive: true,
      },
    });
  }

  /**
   * Evaluates active reasoning nodes to find highly favorable strategic pathways.
   */
  async getFavorableStrategies(tenantId: string) {
    this.logger.log(`Scanning for highly favorable strategic reasoning nodes...`);

    const strategies = await this.prisma.strategicReasoningNode.findMany({
      where: {
        tenantId,
        isActive: true,
        riskRewardRatio: { gte: 3.0 }, // 3:1 Reward to Risk minimum threshold
      },
      orderBy: { riskRewardRatio: "desc" },
    });

    if (strategies.length > 0) {
      this.logger.log(
        `Found ${strategies.length} strategic pathways exceeding minimum risk/reward threshold.`,
      );
    }

    return strategies;
  }
}
