import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveReasoningEngine — "The Cognitive Synthesizer" (Phase 3T)
 *
 * Analyzes deep decision histories to synthesize and register CognitiveReasoningPatterns,
 * enabling faster and safer future workflow convergence based on organizational memory.
 */
@Injectable()
export class AdaptiveReasoningEngine {
  private readonly logger = new Logger(AdaptiveReasoningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synthesizes a reusable reasoning pattern from historical decision nodes.
   */
  async synthesizeReasoningPattern(
    tenantId: string,
    coreId: string,
    signature: string,
    heuristic: unknown,
    confidence: number,
  ) {
    this.logger.warn(`Synthesizing Cognitive Reasoning Pattern. Confidence: ${confidence}`);

    // High confidence patterns can be used by orchestration engines to bypass manual review
    // or slow predictive-simulations for known-good operational paths.
    return this.prisma.cognitiveReasoningPattern.create({
      data: {
        tenantId,
        coreId,
        patternSignature: signature,
        learnedHeuristicJson: JSON.stringify(heuristic),
        confidenceScore: confidence,
      },
    });
  }

  /**
   * Looks up a learned reasoning pattern for a given context signature.
   */
  async lookupReasoningPattern(tenantId: string, coreId: string, signature: string) {
    this.logger.debug(`Looking up Reasoning Pattern for Signature: ${signature}`);

    return this.prisma.cognitiveReasoningPattern.findFirst({
      where: { tenantId, coreId, patternSignature: signature },
      orderBy: { confidenceScore: "desc" },
    });
  }
}
