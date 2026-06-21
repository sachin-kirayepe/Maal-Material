import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WisdomGovernanceEngine — "The Memory Guardrail" (Phase 4C)
 *
 * Enforces WisdomGovernanceCircuit constraints. Evaluates the decay rate of historical data
 * and blocks the system from pivoting based on stale or heavily-biased past data without human override.
 */
@Injectable()
export class WisdomGovernanceEngine {
  private readonly logger = new Logger(WisdomGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a memory governance circuit to bound historical risk.
   */
  async registerWisdomCircuit(
    tenantId: string,
    domain: string,
    maxDataAgeDays: number,
    requiresSignoff: boolean,
  ) {
    this.logger.log(
      `Registering Wisdom Governance Circuit: [${domain}] [Max Age: ${maxDataAgeDays} days]`,
    );

    return this.prisma.wisdomGovernanceCircuit.create({
      data: {
        tenantId,
        wisdomDomain: domain,
        maxDataAgeDays,
        requiresExecutiveSignoff: requiresSignoff,
      },
    });
  }

  /**
   * Validates if a historical data point is still valid for active strategic reasoning.
   */
  async validateHistoricalRelevance(
    tenantId: string,
    domain: string,
    dataAgeDays: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Historical Relevance [Domain: ${domain}] [Data Age: ${dataAgeDays} days]`,
    );

    const circuits = await this.prisma.wisdomGovernanceCircuit.findMany({
      where: { tenantId, wisdomDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No wisdom circuit found for ${domain}. Defaulting to STRICT reject. Manual executive sign-off required.`,
      );
      return false; // Fail-secure. If no rule exists, AI cannot blindly use historical data.
    }

    for (const circuit of circuits) {
      if (circuit.requiresExecutiveSignoff) {
        this.logger.warn(
          `Wisdom Governance: ${domain} historical application requires explicit executive sign-off. BLOCKED.`,
        );
        return false;
      }

      if (dataAgeDays > circuit.maxDataAgeDays) {
        this.logger.error(
          `CRITICAL: Historical data age (${dataAgeDays} days) exceeds Wisdom Circuit limit (${circuit.maxDataAgeDays} days). DATA IS STALE. USE BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Wisdom Governance: Historical data validated for active strategic use in ${domain}.`,
    );
    return true; // Historical data is fresh enough and within acceptable operational limits
  }
}
