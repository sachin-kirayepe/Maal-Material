import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EconomicNervousEngine — "The Commercial Pulse" (Phase 3Y)
 *
 * Orchestrates the EconomicNervousCore, continually assessing macroeconomic health
 * and total capital fluidity across the enterprise ecosystem.
 */
@Injectable()
export class EconomicNervousEngine {
  private readonly logger = new Logger(EconomicNervousEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global economic state of the tenant!.
   */
  async pulseEconomicState(tenantId: string, totalCapital: number, profitabilityIndex: number) {
    this.logger.log(
      `Pulsing Economic State [Capital: ${totalCapital}] [Index: ${profitabilityIndex}]`,
    );

    const core = await this.prisma.economicNervousCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.economicNervousCore.update({
        where: { id: core.id },
        data: {
          totalCapitalAvailability: totalCapital,
          profitabilityIndex,
          lastAssessedAt: new Date(),
        },
      });
    } else {
      return this.prisma.economicNervousCore.create({
        data: {
          tenantId,
          totalCapitalAvailability: totalCapital,
          profitabilityIndex,
        },
      });
    }
  }

  /**
   * Checks if the enterprise is in a healthy economic state to trigger capital-intensive operations.
   */
  async evaluateEconomicHealth(tenantId: string): Promise<boolean> {
    const core = await this.prisma.economicNervousCore.findFirst({
      where: { tenantId },
    });

    if (!core) return false;

    // Reject massive automated orchestration if the profitability index drops too low
    if (core.profitabilityIndex < 0.4) {
      this.logger.warn(
        `CRITICAL: Profitability Index is low (${core.profitabilityIndex}). Halting capital-intensive orchestration.`,
      );
      return false;
    }

    return true;
  }
}
