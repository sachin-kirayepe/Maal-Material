import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AIGovernanceEngine
 *
 * Implements strict, non-bypassable enterprise guardrails over the AI workforce.
 * Ensures agents cannot execute catastrophic financial or operational actions
 * without satisfying minimum confidence scores and explicit policy boundaries.
 */
@Injectable()
export class AIGovernanceEngine {
  private readonly logger = new Logger(AIGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates an agent's intended action against the tenant's AI governance policies.
   */
  async authorizeAgentAction(
    tenantId: string,
    targetDomain: string,
    financialImpact: number,
    agentConfidence: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Evaluating AI Governance for Domain [${targetDomain}] - Impact: $${financialImpact}, Confidence: ${agentConfidence}`,
    );

    const policy = await this.prisma.aIGovernancePolicy.findFirst({
      where: { tenantId, targetDomain },
    });

    if (!policy) {
      this.logger.warn(
        `ZERO TRUST BLOCK: No AI Governance Policy found for domain ${targetDomain}. Action denied.`,
      );
      return false; // Fail-secure
    }

    // Check confidence thresholds
    if (agentConfidence < policy.minConfidence) {
      this.logger.warn(
        `AI BLOCK: Agent confidence (${agentConfidence}) is below the required policy threshold (${policy.minConfidence}).`,
      );
      return false;
    }

    // Check spend limits
    if (policy.maxSpendLimit !== null && financialImpact > policy.maxSpendLimit) {
      this.logger.warn(
        `AI BLOCK: Action impact ($${financialImpact}) exceeds autonomous spend limit ($${policy.maxSpendLimit}). Requires Human Approval.`,
      );
      // In a real system, this would trigger an escalation saga via EscalationOrchestratorEngine
      return false;
    }

    if (policy.requiresApproval) {
      this.logger.log(
        `AI Governance: Action is permissible but requires human-in-the-loop approval per policy.`,
      );
      return false; // Waiting for human intervention
    }

    this.logger.log(`AI Governance: Action Authorized for autonomous execution.`);
    return true;
  }
}
