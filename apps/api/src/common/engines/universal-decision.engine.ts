import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalDecisionEngine — "The Executive Arbiter" (Phase 6B)
 *
 * Manages UniversalDecisionNodes. Evaluates logic and contextual pathways
 * to confidently generate adaptive, safe autonomous decisions for the enterprise.
 */
@Injectable()
export class UniversalDecisionEngine {
  private readonly logger = new Logger(UniversalDecisionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new strategic decision node.
   */
  async draftStrategicDecision(
    tenantId: string,
    domain: string,
    logicHash: string,
    confidence: number,
  ) {
    this.logger.log(`Drafting Strategic Decision [Domain: ${domain}] [Confidence: ${confidence}]`);

    return this.prisma.universalDecisionNode.create({
      data: {
        tenantId,
        decisionDomain: domain,
        decisionLogicHash: logicHash,
        decisionConfidence: confidence,
        actionStatus: "EVALUATING",
      },
    });
  }

  /**
   * Progresses a decision through the execution pipeline based on governance approval.
   */
  async progressDecisionStatus(decisionId: string, status: string) {
    this.logger.debug(`Progressing Universal Decision ${decisionId} to status: ${status}`);

    return this.prisma.universalDecisionNode.update({
      where: { id: decisionId },
      data: { actionStatus: status },
    });
  }
}
