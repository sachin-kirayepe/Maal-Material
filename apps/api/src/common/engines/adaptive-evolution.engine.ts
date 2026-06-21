import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveEvolutionEngine — "The Architecture Optimizer" (Phase 3S)
 *
 * Evaluates AdaptiveEvolutionSignal records to dynamically propose and apply
 * optimizations to orchestration pathways, allowing the system to self-heal
 * and evolve its performance topology.
 */
@Injectable()
export class AdaptiveEvolutionEngine {
  private readonly logger = new Logger(AdaptiveEvolutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a systemic inefficiency signal.
   */
  async registerEvolutionSignal(
    tenantId: string,
    coreId: string,
    frictionType: string,
    score: number,
    proposedOpt: unknown,
  ) {
    this.logger.warn(`Registering Evolution Signal [${frictionType}] for Core: ${coreId}`);

    return this.prisma.adaptiveEvolutionSignal.create({
      data: {
        tenantId,
        coreId,
        frictionType,
        frictionScore: score,
        proposedOptimizationJson: JSON.stringify(proposedOpt),
        status: "DETECTED",
      },
    });
  }

  /**
   * Evaluates pending evolution signals for safe autonomous optimization.
   */
  async evaluatePendingOptimizations(tenantId: string, coreId: string) {
    this.logger.log(`Evaluating Pending Evolutions for Core: ${coreId}`);

    const signals = await this.prisma.adaptiveEvolutionSignal.findMany({
      where: { tenantId, coreId, status: "DETECTED" },
    });

    for (const signal of signals) {
      // In a real system, this invokes the AdaptiveGovernanceEngine to check
      // if the optimization is allowed to be automatically applied.
      this.logger.debug(`Evaluating Signal: ${signal.id}`);

      // Update to evaluating state
      await this.prisma.adaptiveEvolutionSignal.update({
        where: { id: signal.id },
        data: { status: "EVALUATING" },
      });
    }

    return signals;
  }
}
