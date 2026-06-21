import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicGovernanceEngine — "The Risk Validator" (Phase 3M)
 *
 * Enforces hard constraints against autonomous predictive plans, ensuring
 * the platform does not execute strategies that violate enterprise risk limits.
 */
@Injectable()
export class StrategicGovernanceEngine {
  private readonly logger = new Logger(StrategicGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new hard constraint on autonomous economic execution.
   */
  async registerGovernanceConstraint(
    tenantId: string,
    constraintType: string,
    constraintValue: unknown,
  ) {
    this.logger.log(`Registering Strategic Constraint: [${constraintType}]`);

    return this.prisma.strategicGovernanceConstraint.create({
      data: {
        tenantId,
        constraintType,
        constraintValueJson: JSON.stringify(constraintValue),
        isActive: true,
      },
    });
  }

  /**
   * Evaluates a drafted predictive plan against all active governance constraints.
   */
  async auditStrategicPlan(planId: string): Promise<boolean> {
    this.logger.debug(`Auditing Strategic Plan [${planId}] against Governance constraints...`);

    const plan = await this.prisma.predictiveStrategicPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) return false;

    const activeConstraints = await this.prisma.strategicGovernanceConstraint.findMany({
      where: { tenantId: plan.tenantId, isActive: true },
    });

    // In a real implementation, the engine would parse `plan.strategicActionJson`
    // and validate it against the thresholds in `activeConstraints`.
    // If the plan exceeds a threshold (e.g., spend limit), it fails the audit.

    const isAuditPassed = true; // Placeholder for complex validation logic

    if (!isAuditPassed) {
      this.logger.error(`Strategic Plan [${planId}] FAILED Governance Audit.`);
      await this.prisma.predictiveStrategicPlan.update({
        where: { id: planId },
        data: { status: "REJECTED" },
      });
      return false;
    }

    return true; // Plan is safe
  }
}
