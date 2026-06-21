import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AutonomousStrategyGovernanceEngine — "The Strategy Sentinel" (Phase 3U)
 *
 * Acts as the strategic circuit breaker. Validates all proposed preemptive
 * autonomous actions against StrategicGovernancePolicy records to prevent
 * the AI from altering reality unsafely.
 */
@Injectable()
export class AutonomousStrategyGovernanceEngine {
  private readonly logger = new Logger(AutonomousStrategyGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines a safety boundary for autonomous strategic execution.
   */
  async establishStrategicPolicy(
    tenantId: string,
    domain: string,
    maxSpend: number,
    humanReview: boolean,
  ) {
    this.logger.log(`Establishing Strategic Governance Policy for Domain: [${domain}]`);

    return this.prisma.strategicGovernancePolicy.create({
      data: {
        tenantId,
        strategyDomain: domain,
        maxAutonomousSpend: maxSpend,
        requiresHumanReview: humanReview,
      },
    });
  }

  /**
   * Validates if a proposed autonomous strategy is safe to execute without human intervention.
   */
  async validateStrategySafety(
    tenantId: string,
    domain: string,
    estimatedCost: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Strategic Execution Safety [Domain: ${domain}, Cost: $${estimatedCost}]`,
    );

    const rules = await this.prisma.strategicGovernancePolicy.findMany({
      where: { tenantId, strategyDomain: domain },
    });

    if (rules.length === 0) {
      this.logger.warn(
        `No strategic governance rules found for ${domain}. Requiring manual review by default.`,
      );
      return false; // Fail secure: prevent unbounded AI strategy execution
    }

    for (const rule of rules) {
      if (rule.requiresHumanReview) {
        this.logger.warn(`Policy explicitly requires human review for domain ${domain}.`);
        return false;
      }
      if (estimatedCost > rule.maxAutonomousSpend) {
        this.logger.error(
          `CRITICAL: Strategy cost ($${estimatedCost}) exceeds autonomous limit ($${rule.maxAutonomousSpend}). Execution BLOCKED.`,
        );
        return false;
      }
    }

    return true; // Safe to execute autonomously
  }
}
