import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DecisionMemoryEngine — "The Execution Chronicler" (Phase 3T)
 *
 * Captures and links high-value enterprise execution decisions into
 * DecisionMemoryNode records for post-execution AI reasoning analysis.
 */
@Injectable()
export class DecisionMemoryEngine {
  private readonly logger = new Logger(DecisionMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a significant execution decision for future organizational learning.
   */
  async recordDecision(
    tenantId: string,
    coreId: string,
    context: unknown,
    alternatives: unknown,
    chosenPath: string,
    outcomeScore: number,
  ) {
    this.logger.debug(`Recording Decision Memory Node. Chosen Path: ${chosenPath}`);

    return this.prisma.decisionMemoryNode.create({
      data: {
        tenantId,
        coreId,
        decisionContextJson: JSON.stringify(context),
        alternativesEvaluatedJson: JSON.stringify(alternatives),
        chosenPath,
        decisionOutcome: outcomeScore,
      },
    });
  }

  /**
   * Retrieves past decisions in similar contexts.
   */
  async retrieveHistoricalDecisions(tenantId: string, coreId: string) {
    this.logger.log(`Retrieving Historical Decisions for Organizational Learning...`);

    return this.prisma.decisionMemoryNode.findMany({
      where: { tenantId, coreId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
