import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MetaAdaptiveGovernanceEngine — "The Evolution Immune System" (Phase 6A)
 *
 * Enforces AdaptiveGovernanceCircuit constraints. Acts as the platform's immune system,
 * preventing unsafe, unstable, or unauthorized structural mutations from modifying the active enterprise backend.
 */
@Injectable()
export class MetaAdaptiveGovernanceEngine {
  private readonly logger = new Logger(MetaAdaptiveGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a governance circuit for a specific architectural domain.
   */
  async registerAdaptiveCircuit(
    tenantId: string,
    domain: string,
    requiresHuman: boolean,
    riskLevel: number,
  ) {
    this.logger.log(
      `Registering Adaptive Governance Circuit: [${domain}] [Human OK Required: ${requiresHuman}]`,
    );

    return this.prisma.adaptiveGovernanceCircuit.create({
      data: {
        tenantId,
        architecturalDomain: domain,
        requireHumanApproval: requiresHuman,
        maxMutationRiskLevel: riskLevel,
      },
    });
  }

  /**
   * Validates if a proposed autonomous meta-mutation is structurally safe to deploy.
   */
  async validateMutationSafety(
    tenantId: string,
    domain: string,
    mutationRisk: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Structural Mutation [Domain: ${domain}] [Risk Level: ${mutationRisk}/10]`,
    );

    const circuits = await this.prisma.adaptiveGovernanceCircuit.findMany({
      where: { tenantId, architecturalDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No adaptive governance circuit found for ${domain}. Defaulting to STRICT reject. Structural mutation BLOCKED.`,
      );
      return false; // Fail-secure. No structural mutations without an explicit circuit.
    }

    for (const circuit of circuits) {
      if (circuit.requireHumanApproval) {
        this.logger.warn(
          `Adaptive Governance: Domain ${domain} requires explicit human sign-off for structural changes. Autonomous mutation BLOCKED.`,
        );
        return false;
      }

      if (mutationRisk > circuit.maxMutationRiskLevel) {
        this.logger.error(
          `CRITICAL: Mutation risk (${mutationRisk}/10) exceeds domain tolerance (${circuit.maxMutationRiskLevel}/10). PREVENTING INSTABILITY.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Adaptive Governance: Meta-mutation verified against structural safety bounds.`,
    );
    return true; // The AI can safely deploy this code/logic permutation
  }
}
