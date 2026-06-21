import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseWisdomEngine — "The Synaptic Bridge" (Phase 4C)
 *
 * Synchronizes EnterpriseWisdomEdges, acting as the synapse that bridges
 * past historical lessons into active, present-day strategic decision nodes.
 */
@Injectable()
export class EnterpriseWisdomEngine {
  private readonly logger = new Logger(EnterpriseWisdomEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies historical wisdom to a current strategic reasoning node.
   */
  async applyHistoricalWisdom(
    tenantId: string,
    historicalNodeId: string,
    activeReasoningNodeId: string,
    wisdomWeight: number,
  ) {
    this.logger.log(
      `Applying Historical Wisdom [Historical Node: ${historicalNodeId}] -> [Reasoning Node: ${activeReasoningNodeId}] (Weight: ${wisdomWeight})`,
    );

    return this.prisma.enterpriseWisdomEdge.create({
      data: {
        tenantId,
        historicalNodeId,
        activeReasoningNodeId,
        wisdomWeight,
      },
    });
  }

  /**
   * Calculates the total historical wisdom influencing a current decision.
   */
  async calculateAggregateWisdomInfluence(
    tenantId: string,
    activeReasoningNodeId: string,
  ): Promise<number> {
    const edges = await this.prisma.enterpriseWisdomEdge.findMany({
      where: { tenantId, activeReasoningNodeId },
    });

    if (edges.length === 0) return 0;

    const totalWeight = edges.reduce((acc, edge) => acc + edge.wisdomWeight, 0);
    this.logger.debug(
      `Aggregate historical influence for reasoning node ${activeReasoningNodeId} is ${totalWeight}`,
    );

    return totalWeight;
  }
}
