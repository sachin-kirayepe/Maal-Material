import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FinancialGovernanceEngine — "The Vault Circuit Breaker" (Phase 3Y)
 *
 * Validates autonomous commercial decisions against FinancialGovernanceCircuit
 * limits to ensure algorithmic financial safety and prevent capital drain.
 */
@Injectable()
export class FinancialGovernanceEngine {
  private readonly logger = new Logger(FinancialGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a safety limit on automated financial execution.
   */
  async registerFinancialCircuit(tenantId: string, domain: string, maxVelocity: number) {
    this.logger.log(
      `Registering Financial Governance Circuit: [${domain}] [Max Velocity: $${maxVelocity}/hr]`,
    );

    return this.prisma.financialGovernanceCircuit.create({
      data: {
        tenantId,
        governanceDomain: domain,
        maxSpendVelocity: maxVelocity,
        isActive: true,
      },
    });
  }

  /**
   * Evaluates if a proposed autonomous financial transaction is within safe limits.
   */
  async validateAutomatedSpend(
    tenantId: string,
    domain: string,
    proposedSpendAmount: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Automated Spend [Domain: ${domain}] [Amount: $${proposedSpendAmount}]`,
    );

    const circuits = await this.prisma.financialGovernanceCircuit.findMany({
      where: { tenantId, governanceDomain: domain, isActive: true },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No financial circuit breaker found for ${domain}. Defaulting to STRICT reject. $0 allowed.`,
      );
      return false; // Fail-secure. If no rule exists, autonomous AI cannot spend money.
    }

    for (const circuit of circuits) {
      if (proposedSpendAmount > circuit.maxSpendVelocity) {
        this.logger.error(
          `CRITICAL: Proposed spend ($${proposedSpendAmount}) exceeds Governance Circuit limit ($${circuit.maxSpendVelocity}). SPEND BLOCKED.`,
        );
        return false;
      }
    }

    return true; // Spend is safe and within limits
  }
}
