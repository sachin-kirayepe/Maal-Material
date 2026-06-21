import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ReasoningGovernanceEngine — "The Cognitive Sentinel" (Phase 6B)
 *
 * Enforces ReasoningGovernanceCircuit constraints. The ultimate safety net ensuring
 * no autonomous decision executes without meeting enterprise-mandated semantic confidence and risk limits.
 */
@Injectable()
export class ReasoningGovernanceEngine {
  private readonly logger = new Logger(ReasoningGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a governance circuit for a specific decision domain.
   */
  async registerReasoningCircuit(
    tenantId: string,
    domain: string,
    minConfidence: number,
    requiresHuman: boolean,
  ) {
    this.logger.log(
      `Registering Reasoning Governance Circuit: [${domain}] [Min Confidence: ${minConfidence}]`,
    );

    return this.prisma.reasoningGovernanceCircuit.create({
      data: {
        tenantId,
        decisionDomain: domain,
        minimumConfidenceThreshold: minConfidence,
        requireHumanSignOff: requiresHuman,
      },
    });
  }

  /**
   * Validates if a proposed autonomous strategic decision is safe to execute based on AI confidence.
   */
  async validateDecisionSafety(
    tenantId: string,
    domain: string,
    aiConfidence: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Strategic Decision [Domain: ${domain}] [AI Confidence: ${aiConfidence}]`,
    );

    const circuits = await this.prisma.reasoningGovernanceCircuit.findMany({
      where: { tenantId, decisionDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No reasoning governance circuit found for ${domain}. Defaulting to STRICT reject. Decision BLOCKED.`,
      );
      return false; // Fail-secure
    }

    for (const circuit of circuits) {
      if (circuit.requireHumanSignOff) {
        this.logger.warn(
          `Reasoning Governance: Domain ${domain} requires explicit human sign-off for execution. Autonomous action BLOCKED.`,
        );
        return false;
      }

      if (aiConfidence < circuit.minimumConfidenceThreshold) {
        this.logger.error(
          `CRITICAL: AI Confidence (${aiConfidence}) is below the required domain threshold (${circuit.minimumConfidenceThreshold}). PREVENTING EXECUTION.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Reasoning Governance: Strategic decision validated. The AI meets the required confidence threshold.`,
    );
    return true; // The AI can safely execute the operational logic
  }
}
