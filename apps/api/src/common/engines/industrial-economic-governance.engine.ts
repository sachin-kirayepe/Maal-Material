import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialEconomicGovernanceEngine — "The Financial Fail-Safe" (Phase 7B)
 *
 * Enforces EconomicGovernanceCircuit constraints. The ultimate safety net ensuring
 * the AI cannot autonomously execute economically devastating actions (like 99% discounts).
 */
@Injectable()
export class IndustrialEconomicGovernanceEngine {
  private readonly logger = new Logger(IndustrialEconomicGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Provisions a zero-trust financial boundary for an economic domain.
   */
  async provisionEconomicBoundary(
    tenantId: string,
    domain: string,
    maxDiscountPercent: number,
    requireExecSignoff: boolean,
  ) {
    this.logger.log(
      `Provisioning Economic Boundary [Domain: ${domain}] [Max Discount: ${maxDiscountPercent}%]`,
    );

    return this.prisma.economicGovernanceCircuit.create({
      data: {
        tenantId,
        economicDomain: domain,
        maxAutonomousDiscountPercentage: maxDiscountPercent,
        requiresExecutiveApproval: requireExecSignoff,
      },
    });
  }

  /**
   * Validates if a proposed AI-driven price drop is legally safe to execute.
   */
  async validatePricingAdjustment(
    tenantId: string,
    domain: string,
    proposedDiscountPercent: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Economic Action [Domain: ${domain}] [Proposed Discount: ${proposedDiscountPercent}%]`,
    );

    const circuits = await this.prisma.economicGovernanceCircuit.findMany({
      where: { tenantId, economicDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.error(
        `CRITICAL: No economic circuit found for Domain ${domain}. Defaulting to STRICT reject. Financial action BLOCKED.`,
      );
      return false; // Fail-secure. Unregistered domains cannot be touched autonomously.
    }

    for (const circuit of circuits) {
      if (proposedDiscountPercent > circuit.maxAutonomousDiscountPercentage) {
        this.logger.warn(
          `Economic Governance: Proposed discount of ${proposedDiscountPercent}% EXCEEDS allowed max of ${circuit.maxAutonomousDiscountPercentage}%. Action BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Economic Governance: Adjustment is within safe parameters. Execution cleared.`,
    );
    return true; // The AI is acting safely
  }
}
