import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EvolutionGovernanceEngine — "The Mutation Circuit Breaker" (Phase 4A)
 *
 * Enforces EvolutionGovernanceCircuit constraints to prevent unsafe runaway
 * algorithmic self-modification or workflow mutation without human override.
 */
@Injectable()
export class EvolutionGovernanceEngine {
  private readonly logger = new Logger(EvolutionGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a safety constraint governing how much a system domain can autonomously self-modify.
   */
  async registerEvolutionCircuit(
    tenantId: string,
    domain: string,
    maxImpact: number,
    requiresOverride: boolean,
  ) {
    this.logger.log(
      `Registering Evolution Governance Circuit: [${domain}] [Max Impact: ${maxImpact}]`,
    );

    return this.prisma.evolutionGovernanceCircuit.create({
      data: {
        tenantId,
        mutationDomain: domain,
        maxAutonomousMutationImpact: maxImpact,
        requiresHumanOverride: requiresOverride,
      },
    });
  }

  /**
   * Validates if a proposed algorithmic workflow mutation is safe to deploy automatically.
   */
  async validateAlgorithmicMutation(
    tenantId: string,
    domain: string,
    proposedImpact: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Algorithmic Mutation [Domain: ${domain}] [Impact: ${proposedImpact}]`,
    );

    const circuits = await this.prisma.evolutionGovernanceCircuit.findMany({
      where: { tenantId, mutationDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No evolution circuit found for ${domain}. Defaulting to STRICT reject. Manual override required.`,
      );
      return false; // Fail-secure. If no rule exists, AI cannot mutate the workflow.
    }

    for (const circuit of circuits) {
      if (circuit.requiresHumanOverride) {
        this.logger.warn(
          `Evolution Governance: ${domain} mutation requires explicit human override. BLOCKED.`,
        );
        return false;
      }

      if (proposedImpact > circuit.maxAutonomousMutationImpact) {
        this.logger.error(
          `CRITICAL: Proposed mutation impact (${proposedImpact}) exceeds Evolution Circuit limit (${circuit.maxAutonomousMutationImpact}). MUTATION BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Evolution Governance: Mutation approved for autonomous deployment in ${domain}.`,
    );
    return true; // Mutation is safe and within limits
  }
}
