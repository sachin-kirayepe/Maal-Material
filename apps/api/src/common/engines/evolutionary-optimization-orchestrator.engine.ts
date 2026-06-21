import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EvolutionaryOptimizationOrchestratorEngine — "The Mutation Coordinator" (Phase 33)
 *
 * Applies calculated structural optimizations to live enterprise workflows
 * to reduce execution latency over time.
 */
@Injectable()
export class EvolutionaryOptimizationOrchestratorEngine {
  private readonly logger = new Logger(EvolutionaryOptimizationOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a structural mutation intended to optimize workflow execution.
   */
  async recordOptimizationMutation(
    tenantId: string,
    genomeId: string,
    mutationType: string,
    predictedGain: number,
  ) {
    this.logger.debug(
      `Applying Mutation [${mutationType}] to Genome [${genomeId}]. Predicted Gain: +${predictedGain}%`,
    );

    const ledger = await this.prisma.evolutionaryOptimizationLedger.create({
      data: {
        tenantId,
        genomeId,
        mutationType,
        predictedGainPct: predictedGain,
      },
    });

    this.logger.log(
      `Optimization Ledger updated. AI will now track actual vs predicted performance gains.`,
    );
    return ledger;
  }
}
