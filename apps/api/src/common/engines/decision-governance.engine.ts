import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DecisionGovernanceEngine — "The Executive Guardrail" (Phase 4B)
 *
 * Enforces DecisionGovernanceCircuit constraints to prevent strategic AI from executing
 * massive organizational shifts without explicit human executive sign-off.
 */
@Injectable()
export class DecisionGovernanceEngine {
  private readonly logger = new Logger(DecisionGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers an executive safety circuit to bound strategic reasoning impact.
   */
  async registerDecisionCircuit(
    tenantId: string,
    domain: string,
    blastRadius: number,
    requiresSignoff: boolean,
  ) {
    this.logger.log(
      `Registering Decision Governance Circuit: [${domain}] [Max Blast Radius: ${blastRadius}]`,
    );

    return this.prisma.decisionGovernanceCircuit.create({
      data: {
        tenantId,
        decisionDomain: domain,
        maxAutonomyBlastRadius: blastRadius,
        requiresExecutiveSignoff: requiresSignoff,
      },
    });
  }

  /**
   * Validates if a proposed strategic decision is safe to orchestrate automatically.
   */
  async validateStrategicAutonomy(
    tenantId: string,
    domain: string,
    proposedBlastRadius: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Strategic Autonomy [Domain: ${domain}] [Blast Radius: ${proposedBlastRadius}]`,
    );

    const circuits = await this.prisma.decisionGovernanceCircuit.findMany({
      where: { tenantId, decisionDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No decision circuit found for ${domain}. Defaulting to STRICT reject. Manual executive sign-off required.`,
      );
      return false; // Fail-secure. If no rule exists, AI cannot execute the strategy.
    }

    for (const circuit of circuits) {
      if (circuit.requiresExecutiveSignoff) {
        this.logger.warn(
          `Decision Governance: ${domain} strategy requires explicit executive sign-off. BLOCKED.`,
        );
        return false;
      }

      if (proposedBlastRadius > circuit.maxAutonomyBlastRadius) {
        this.logger.error(
          `CRITICAL: Proposed strategy blast radius (${proposedBlastRadius}) exceeds Decision Circuit limit (${circuit.maxAutonomyBlastRadius}). STRATEGY BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Decision Governance: Strategy approved for autonomous execution in ${domain}.`,
    );
    return true; // Strategy is safe and within acceptable operational limits
  }
}
