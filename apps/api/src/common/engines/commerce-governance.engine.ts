import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CommerceGovernanceEngine — "The Economic Circuit Breaker" (Phase 3P)
 *
 * Ensures that automated trading, procurement, and market optimizations
 * remain within strict financial risk limits defined by enterprise policies.
 */
@Injectable()
export class CommerceGovernanceEngine {
  private readonly logger = new Logger(CommerceGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers an absolute financial boundary for automated commerce.
   */
  async establishEconomicGuardrail(
    tenantId: string,
    policyDomain: string,
    maxRiskExposure: number,
    rules: unknown,
  ) {
    this.logger.log(
      `Establishing Economic Guardrail for [${policyDomain}] | Max Risk: $${maxRiskExposure}`,
    );

    return this.prisma.commerceGovernancePolicy.create({
      data: {
        tenantId,
        policyDomain,
        maxRiskExposure,
        policyRulesJson: JSON.stringify(rules),
        isActive: true,
      },
    });
  }

  /**
   * Validates if a proposed transaction is financially safe to automatically execute.
   */
  async validateTransactionSafety(
    tenantId: string,
    transactionValue: number,
    policyDomain: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Tx Safety [Domain: ${policyDomain}] | Value: $${transactionValue}`,
    );

    const activePolicies = await this.prisma.commerceGovernancePolicy.findMany({
      where: { tenantId, policyDomain, isActive: true },
    });

    if (activePolicies.length === 0) {
      return true; // No constraints for this domain
    }

    // Evaluate against the strictest matching policy
    const strictPolicy = activePolicies.reduce((prev, current) =>
      prev.maxRiskExposure < current.maxRiskExposure ? prev : current,
    );

    if (transactionValue > strictPolicy.maxRiskExposure) {
      this.logger.error(
        `CRITICAL: Automated transaction value ($${transactionValue}) exceeds max risk exposure ($${strictPolicy.maxRiskExposure}). Execution blocked.`,
      );
      return false;
    }

    return true;
  }
}
