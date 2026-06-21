import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CivilizationGovernanceEngine — "The Geo-Fencing Guardian" (Phase 5C)
 *
 * Enforces CivilizationGovernanceCircuit constraints. The ultimate fail-safe that protects
 * the planetary execution network from systemic cascading faults and strictly polices international data boundaries.
 */
@Injectable()
export class CivilizationGovernanceEngine {
  private readonly logger = new Logger(CivilizationGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a planetary governance circuit for a global domain.
   */
  async registerPlanetaryCircuit(
    tenantId: string,
    domain: string,
    enforceGeoFencing: boolean,
    maxPlanetaryRisk: number,
  ) {
    this.logger.log(
      `Registering Civilization Governance Circuit: [${domain}] [Enforce Geo-Fence: ${enforceGeoFencing}]`,
    );

    return this.prisma.civilizationGovernanceCircuit.create({
      data: {
        tenantId,
        globalDomain: domain,
        enforceStrictGeoFencing: enforceGeoFencing,
        maxPlanetaryRiskLevel: maxPlanetaryRisk,
      },
    });
  }

  /**
   * Validates if a cross-border orchestration is legally and operationally permitted at a civilization scale.
   */
  async validateGlobalExecution(
    tenantId: string,
    domain: string,
    targetRegion: string,
    riskLevel: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Global Execution [Domain: ${domain}] [Target: ${targetRegion}] [Risk Level: ${riskLevel}/10]`,
    );

    const circuits = await this.prisma.civilizationGovernanceCircuit.findMany({
      where: { tenantId, globalDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No civilization governance circuit found for ${domain}. Defaulting to STRICT reject. Cross-border execution BLOCKED.`,
      );
      return false; // Fail-secure. No global execution without an explicit circuit.
    }

    for (const circuit of circuits) {
      if (circuit.enforceStrictGeoFencing) {
        this.logger.warn(
          `Civilization Governance: Domain ${domain} is strictly geo-fenced. Data and execution cannot cross international boundaries.`,
        );
        return false;
      }

      if (riskLevel > circuit.maxPlanetaryRiskLevel) {
        this.logger.error(
          `CRITICAL: Global execution risk (${riskLevel}/10) exceeds planetary limit (${circuit.maxPlanetaryRiskLevel}/10). PREVENTING CASCADING FAULT.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Civilization Governance: Cross-border execution verified against international compliance boundaries.`,
    );
    return true; // The AI can safely route this workload globally
  }
}
