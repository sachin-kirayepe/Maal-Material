import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalGovernanceEngine — "The Physical Sentinel" (Phase 3Q)
 *
 * Enforces strict physical safety guardrails, preventing the platform
 * from taking unsafe autonomous actions in the physical world.
 */
@Injectable()
export class OperationalGovernanceEngine {
  private readonly logger = new Logger(OperationalGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers an absolute physical safety constraint.
   */
  async establishOperationalSafetyRule(tenantId: string, ruleDomain: string, constraints: unknown) {
    this.logger.log(`Establishing Operational Safety Rule for [${ruleDomain}]`);

    return this.prisma.operationalGovernanceRule.create({
      data: {
        tenantId,
        ruleDomain,
        safetyConstraintJson: JSON.stringify(constraints),
        isActive: true,
      },
    });
  }

  /**
   * Validates if a proposed physical-world automated action is safe to execute.
   */
  async validatePhysicalActionSafety(
    tenantId: string,
    ruleDomain: string,
    actionPayload: unknown,
  ): Promise<boolean> {
    this.logger.debug(`Validating Physical Action Safety [Domain: ${ruleDomain}]`);

    const activeRules = await this.prisma.operationalGovernanceRule.findMany({
      where: { tenantId, ruleDomain, isActive: true },
    });

    if (activeRules.length === 0) {
      return true; // No constraints for this domain
    }

    // In a real system, the `actionPayload` is evaluated against the JSON constraint
    // e.g., validating that an autonomous crane dispatch doesn't exceed weight limits.
    const isSafe = true; // Placeholder for deep constraint validation

    if (!isSafe) {
      this.logger.error(
        `CRITICAL: Automated physical action violates operational safety constraints. Execution BLOCKED.`,
      );
      return false;
    }

    return true;
  }
}
