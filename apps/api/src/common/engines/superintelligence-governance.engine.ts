import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SuperintelligenceGovernanceEngine — "The Civilization Fail-Safe" (Phase 7C)
 *
 * Enforces SuperintelligenceGovernanceCircuit constraints. Guarantees that super-intelligent
 * cross-domain synthesis never executes outside human-approved macro-parameters.
 */
@Injectable()
export class SuperintelligenceGovernanceEngine {
  private readonly logger = new Logger(SuperintelligenceGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Provisions a zero-trust universal boundary across macro-domains.
   */
  async provisionMacroBoundary(
    tenantId: string,
    boundaryName: string,
    allowUnsupervised: boolean,
    requireSignoff: boolean,
  ) {
    this.logger.log(
      `Provisioning Superintelligence Boundary [${boundaryName}] Unsupervised: ${allowUnsupervised}`,
    );

    return this.prisma.superintelligenceGovernanceCircuit.create({
      data: {
        tenantId,
        macroDomainBoundary: boundaryName,
        allowUnsupervisedBridging: allowUnsupervised,
        requiresExecutiveSignoff: requireSignoff,
      },
    });
  }

  /**
   * Validates whether a cross-domain orchestration is legally allowed to execute autonomously.
   */
  async validateCrossDomainExecution(tenantId: string, boundaryName: string): Promise<boolean> {
    this.logger.debug(`Validating Cross-Domain Superintelligence Execution [${boundaryName}]`);

    const circuit = await this.prisma.superintelligenceGovernanceCircuit.findFirst({
      where: { tenantId, macroDomainBoundary: boundaryName },
    });

    if (!circuit) {
      this.logger.error(
        `CRITICAL: No macro-boundary circuit found for ${boundaryName}. Defaulting to STRICT reject. Cross-Domain action BLOCKED.`,
      );
      return false; // Fail-secure.
    }

    if (!circuit.allowUnsupervisedBridging) {
      this.logger.warn(
        `Superintelligence Governance: Circuit [${boundaryName}] explicitly denies unsupervised bridging. Action BLOCKED.`,
      );
      return false;
    }

    this.logger.log(
      `Superintelligence Governance: Macro-boundary [${boundaryName}] cleared for autonomous execution.`,
    );
    return true;
  }
}
