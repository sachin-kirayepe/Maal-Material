import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SimulationGovernanceEngine — "The Reality Guardrail" (Phase 4D)
 *
 * Enforces SimulationGovernanceCircuit constraints, preventing the AI from executing
 * preemptive actions based on low-confidence or highly speculative "black swan" simulation artifacts.
 */
@Injectable()
export class SimulationGovernanceEngine {
  private readonly logger = new Logger(SimulationGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a simulation governance circuit to bound predictive execution risk.
   */
  async registerSimulationCircuit(
    tenantId: string,
    domain: string,
    minConfidence: number,
    requiresSignoff: boolean,
  ) {
    this.logger.log(
      `Registering Simulation Governance Circuit: [${domain}] [Min Confidence: ${minConfidence}]`,
    );

    return this.prisma.simulationGovernanceCircuit.create({
      data: {
        tenantId,
        simulationDomain: domain,
        minConfidenceThreshold: minConfidence,
        requiresExecutiveSignoff: requiresSignoff,
      },
    });
  }

  /**
   * Validates if a predictive simulation is confident enough to warrant autonomous preemptive action.
   */
  async validatePredictiveAction(
    tenantId: string,
    domain: string,
    simulationConfidence: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Predictive Action [Domain: ${domain}] [Confidence: ${simulationConfidence}]`,
    );

    const circuits = await this.prisma.simulationGovernanceCircuit.findMany({
      where: { tenantId, simulationDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No simulation circuit found for ${domain}. Defaulting to STRICT reject. Manual executive sign-off required.`,
      );
      return false; // Fail-secure. If no rule exists, AI cannot preemptively act on forecasts.
    }

    for (const circuit of circuits) {
      if (circuit.requiresExecutiveSignoff) {
        this.logger.warn(
          `Simulation Governance: Preemptive action in ${domain} requires explicit executive sign-off. BLOCKED.`,
        );
        return false;
      }

      if (simulationConfidence < circuit.minConfidenceThreshold) {
        this.logger.error(
          `CRITICAL: Simulation confidence (${simulationConfidence}) is below the required threshold (${circuit.minConfidenceThreshold}). FORECAST TOO UNCERTAIN. PREEMPTIVE ACTION BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Simulation Governance: Predictive confidence validated. Preemptive action in ${domain} approved.`,
    );
    return true; // Predictive model is highly confident and safe to act upon
  }
}
