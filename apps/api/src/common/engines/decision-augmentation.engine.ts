import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * DecisionAugmentationEngine — "The Strategic Advisor" (Phase 3B)
 *
 * Generates structured decision proposals with multi-factor analysis
 * (risk, cost, confidence, precedent) for human-in-the-loop approval.
 * The engine never executes autonomously — it augments human judgment
 * by presenting the best-available options ranked by AI confidence.
 */
@Injectable()
export class DecisionAugmentationEngine {
  private readonly logger = new Logger(DecisionAugmentationEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Generates a structured decision proposal for a specific operational domain.
   */
  async proposeDecision(
    tenantId: string,
    decisionDomain: string,
    options: { action: string; confidence: number; riskLevel: string; rationale: string }[],
  ) {
    // Select highest-confidence option as recommendation
    const sorted = [...options].sort((a, b) => b.confidence - a.confidence);
    const recommended = sorted[0];

    this.logger.log(
      `Proposing Decision in [${decisionDomain}]: Recommended [${recommended!.action}] (${(recommended!.confidence * 100).toFixed(1)}% confidence)`,
    );

    const proposal = await this.prisma.decisionAugmentationProposal.create({
      data: {
        tenantId,
        decisionDomain,
        proposalJson: JSON.stringify({ options: sorted }),
        recommendedAction: recommended!.action,
        confidenceScore: recommended!.confidence,
        status: "PENDING",
      },
    });

    this.eventDispatcher.dispatch("intelligence", "decision_proposal_generated", {
      tenantId,
      proposalId: proposal.id,
      domain: decisionDomain,
      recommendedAction: recommended!.action,
    });

    return proposal;
  }

  /**
   * Records a human verdict on a pending proposal.
   */
  async recordVerdict(proposalId: string, verdict: "APPROVED" | "REJECTED" | "MODIFIED") {
    this.logger.log(`Human Verdict on Proposal [${proposalId}]: ${verdict}`);

    return this.prisma.decisionAugmentationProposal.update({
      where: { id: proposalId },
      data: {
        humanVerdict: verdict,
        status: verdict === "REJECTED" ? "REJECTED" : "APPROVED",
      },
    });
  }
}
