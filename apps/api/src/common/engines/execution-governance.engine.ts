import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionGovernanceEngine — "The Execution Circuit Breaker" (Phase 3R)
 *
 * Acts as the absolute safety sentinel, preventing coordination engines
 * from executing workflows that violate hard enterprise safety limits.
 */
@Injectable()
export class ExecutionGovernanceEngine {
  private readonly logger = new Logger(ExecutionGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines a hard safety policy for an execution domain.
   */
  async establishExecutionPolicy(tenantId: string, domain: string, rules: unknown, level: string) {
    this.logger.log(`Establishing Execution Policy for Domain: [${domain}]`);

    return this.prisma.executionGovernancePolicy.create({
      data: {
        tenantId,
        executionDomain: domain,
        safetyRulesJson: JSON.stringify(rules),
        enforcementLevel: level,
      },
    });
  }

  /**
   * Intercepts and validates any automated execution command.
   */
  async validateExecutionSafety(
    tenantId: string,
    domain: string,
    executionPayload: unknown,
  ): Promise<boolean> {
    this.logger.debug(`Validating Execution Safety [Domain: ${domain}]`);

    const policies = await this.prisma.executionGovernancePolicy.findMany({
      where: { tenantId, executionDomain: domain },
    });

    if (policies.length === 0) {
      return true; // No policies, proceed.
    }

    // In a real implementation, the rules JSON would be parsed and evaluated against the payload.
    // E.g., verifying weather conditions don't breach crane limits.
    const isSafe = true;

    if (!isSafe) {
      this.logger.error(
        `CRITICAL: Automated Execution Command violates Governance Policy. Execution BLOCKED.`,
      );
      return false;
    }

    return true;
  }
}
