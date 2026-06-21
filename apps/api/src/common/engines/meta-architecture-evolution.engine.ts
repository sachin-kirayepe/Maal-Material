import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MetaArchitectureEvolutionEngine — "The Architecture CNS (Central Nervous System)" (Phase 6A)
 *
 * Orchestrates the AdaptiveEvolutionCore. Acts as the central nervous system tracking
 * how fast and safely the platform is adapting to new systemic loads.
 */
@Injectable()
export class MetaArchitectureEvolutionEngine {
  private readonly logger = new Logger(MetaArchitectureEvolutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the overall evolutionary quotient and mutation count of the enterprise grid.
   */
  async recordArchitecturalMutation(tenantId: string, evolutionQuotient: number) {
    this.logger.log(`Recording Architectural Mutation [Evolution Quotient: ${evolutionQuotient}]`);

    const core = await this.prisma.adaptiveEvolutionCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.adaptiveEvolutionCore.update({
        where: { id: core.id },
        data: {
          totalArchitecturalMutations: core.totalArchitecturalMutations + 1,
          systemicEvolutionQuotient: evolutionQuotient,
          lastMutationAppliedAt: new Date(),
        },
      });
    } else {
      return this.prisma.adaptiveEvolutionCore.create({
        data: {
          tenantId,
          totalArchitecturalMutations: 1,
          systemicEvolutionQuotient: evolutionQuotient,
        },
      });
    }
  }

  /**
   * Evaluates if the system is mutating too rapidly, risking architectural destabilization.
   */
  async evaluateEvolutionStability(tenantId: string): Promise<boolean> {
    const core = await this.prisma.adaptiveEvolutionCore.findFirst({
      where: { tenantId },
    });

    // If evolution quotient drops or mutations are happening too fast, trigger stability alarms
    if (core && core.systemicEvolutionQuotient < 0.85) {
      this.logger.warn(
        `Systemic Evolution is destabilizing the grid (Quotient: ${core.systemicEvolutionQuotient}). Throttling adaptive mutation rate.`,
      );
      return false;
    }

    return true;
  }
}
