import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EconomicGovernanceEngine — "The Fiscal Regulator" (Phase 3E)
 *
 * Enforces automated enterprise economic policies based on current market signals.
 * If market volatility exceeds configured thresholds (e.g., steel prices double),
 * this engine intercepts procurement workflows and applies enforcement actions (e.g., HARD_BLOCK).
 */
@Injectable()
export class EconomicGovernanceEngine {
  private readonly logger = new Logger(EconomicGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines a new economic governance policy.
   */
  async establishPolicy(
    tenantId: string,
    policyName: string,
    targetDomain: string,
    triggerCondition: string,
    enforcementAction: "REQUIRE_APPROVAL" | "HARD_BLOCK",
  ) {
    this.logger.log(
      `Establishing Economic Policy [${policyName}] for domain [${targetDomain}] — Enforcement: ${enforcementAction}`,
    );

    return this.prisma.economicGovernancePolicy.create({
      data: {
        tenantId,
        policyName,
        targetDomain,
        triggerCondition,
        enforcementAction,
        isActive: true,
      },
    });
  }

  /**
   * Evaluates if a proposed transaction or workflow violates active economic policies
   * given the current market signals.
   */
  async evaluateTransaction(
    tenantId: string,
    targetDomain: string,
    transactionContext: unknown,
  ): Promise<{ allowed: boolean; reason?: string; requiredAction?: string }> {
    const activePolicies = await this.prisma.economicGovernancePolicy.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [{ targetDomain: targetDomain }, { targetDomain: "ALL" }],
      },
    });

    if (activePolicies.length === 0) {
      return { allowed: true };
    }

    // Fetch active CRITICAL market signals for this domain
    const activeSignals = await this.prisma.industrialMarketSignal.findMany({
      where: {
        domain: targetDomain,
        isActive: true,
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    });

    for (const policy of activePolicies) {
      // Stub: Evaluate `triggerCondition` against the active signals and context.
      // E.g., if policy is "HALT ON CRITICAL" and activeSignals.length > 0
      const isTriggered = this.simulateConditionEvaluation(
        policy.triggerCondition,
        activeSignals,
        transactionContext,
      );

      if (isTriggered) {
        this.logger.warn(
          `Economic Policy Triggered: [${policy.policyName}] for domain ${targetDomain}. Action: ${policy.enforcementAction}`,
        );

        if (policy.enforcementAction === "HARD_BLOCK") {
          return { allowed: false, reason: `Blocked by Economic Policy: ${policy.policyName}` };
        } else if (policy.enforcementAction === "REQUIRE_APPROVAL") {
          return { allowed: false, requiredAction: "ESCALATE_TO_EXECUTIVE" };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Internal stub for parsing string conditions (e.g., "VOLATILITY > 0.15") against live context.
   */
  private simulateConditionEvaluation(
    condition: string,
    signals: unknown[],
    context: unknown,
  ): boolean {
    // If there are critical signals, we assume a triggering event for demonstration.
    return signals.length > 0;
  }
}
