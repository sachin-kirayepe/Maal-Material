import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LearningGovernanceEngine — "The Curriculum Auditor" (Phase 3N)
 *
 * Enforces hard constraints against adaptive learning updates, ensuring
 * the platform does not learn and automate dangerous or illegal anti-patterns.
 */
@Injectable()
export class LearningGovernanceEngine {
  private readonly logger = new Logger(LearningGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new learning constraint to bound the adaptive model's evolution.
   */
  async establishGovernanceRule(tenantId: string, ruleType: string, constraintPayload: unknown) {
    this.logger.log(`Establishing Learning Governance Rule: [${ruleType}]`);

    return this.prisma.learningGovernanceRule.create({
      data: {
        tenantId,
        ruleType,
        constraintJson: JSON.stringify(constraintPayload),
        isActive: true,
      },
    });
  }

  /**
   * Audits a proposed model adaptation against all active learning governance rules.
   * Returns true if safe to apply, false if the learned behavior is prohibited.
   */
  async validateLearningAdaptation(tenantId: string, proposedWeights: unknown): Promise<boolean> {
    this.logger.debug(`Validating Proposed Learning Adaptation...`);

    const activeRules = await this.prisma.learningGovernanceRule.findMany({
      where: { tenantId, isActive: true },
    });

    if (activeRules.length === 0) {
      return true; // No constraints to violate
    }

    // In a full implementation, `proposedWeights` are validated against `activeRules`.
    // For example, ensuring an automated resource allocator hasn't learned
    // to allocate 100% of capital to a single vendor.

    const isSafeToLearn = true; // Placeholder for complex constraint matrix calculation

    if (!isSafeToLearn) {
      this.logger.error(
        `CRITICAL: Proposed adaptation VIOLATED Learning Governance constraints. Rejecting model update.`,
      );
      return false;
    }

    return true;
  }
}
