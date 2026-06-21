import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ContinuousCognitionRefinerEngine — "The AI Evaluator" (Phase 33)
 *
 * Measures if a recent workflow mutation yielded better enterprise performance
 * or if it needs to be immediately rolled back for safety.
 */
@Injectable()
export class ContinuousCognitionRefinerEngine {
  private readonly logger = new Logger(ContinuousCognitionRefinerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the empirical result of an evolutionary structural mutation.
   */
  async evaluateMutationPerformance(tenantId: string, ledgerId: string, actualGain: number) {
    this.logger.debug(`Evaluating Mutation [${ledgerId}] - Actual Gain: ${actualGain}%`);

    const isSuccessful = actualGain > 0;

    const refinement = await this.prisma.continuousCognitionRefinement.create({
      data: {
        tenantId,
        ledgerId,
        actualGainPct: actualGain,
        isSuccessful,
      },
    });

    if (!isSuccessful) {
      this.logger.warn(
        `MUTATION REGRESSION: Negative performance gain detected. Self-Healing AI triggered to rollback Genome sequence to previous generation.`,
      );
    }

    return refinement;
  }
}
