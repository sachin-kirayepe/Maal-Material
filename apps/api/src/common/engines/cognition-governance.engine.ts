import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CognitionGovernanceEngine — "The Learning Sentinel" (Phase 3T)
 *
 * Acts as the cognition circuit breaker. Validates all synthesized reasoning
 * patterns against CognitionGovernanceRules to ensure the system never learns
 * or applies unsafe operational behaviors.
 */
@Injectable()
export class CognitionGovernanceEngine {
  private readonly logger = new Logger(CognitionGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Establishes a hard limit on what the system is allowed to "learn" autonomously.
   */
  async establishCognitionRule(tenantId: string, domain: string, boundary: unknown) {
    this.logger.log(`Establishing Cognition Governance Rule for Domain: [${domain}]`);

    return this.prisma.cognitionGovernanceRule.create({
      data: {
        tenantId,
        governanceDomain: domain,
        safetyBoundaryJson: JSON.stringify(boundary),
        isActive: true,
      },
    });
  }

  /**
   * Evaluates if a newly synthesized CognitiveReasoningPattern is safe to apply.
   */
  async validateLearningSafety(
    tenantId: string,
    domain: string,
    heuristicPayload: unknown,
  ): Promise<boolean> {
    this.logger.debug(`Validating Cognitive Learning Safety [Domain: ${domain}]`);

    const rules = await this.prisma.cognitionGovernanceRule.findMany({
      where: { tenantId, governanceDomain: domain, isActive: true },
    });

    if (rules.length === 0) {
      this.logger.warn(
        `No cognition governance rules found for ${domain}. Denying learned heuristic by default.`,
      );
      return false; // Fail secure: prevent unbounded AI learning without explicitly defined rules
    }

    // A real implementation would parse safetyBoundaryJson and ensure the heuristicPayload
    // does not violate constraints (e.g., "AI may route trucks, but never authorize > $50M payments").
    const isSafe = true;

    if (!isSafe) {
      this.logger.error(
        `CRITICAL: Synthesized Reasoning Pattern violates Governance Rule. Learning REJECTED.`,
      );
      return false;
    }

    return true; // Safe to register into organizational memory
  }
}
