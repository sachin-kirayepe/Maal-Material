import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CausalIntelligenceEngine — "The Butterfly Effect Predictor" (Phase 6C)
 *
 * Synchronizes CausalIntelligenceEdges. Evaluates live telemetry against semantic
 * pathways to predict immediate physical cascading failures before they manifest.
 */
@Injectable()
export class CausalIntelligenceEngine {
  private readonly logger = new Logger(CausalIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Identifies a real-time cascading risk between two physical assets.
   */
  async predictCascadingFailure(
    tenantId: string,
    originId: string,
    impactedId: string,
    timeToImpactMs: number,
    probability: number,
  ) {
    this.logger.warn(
      `Predicting Causal Failure: Asset [${originId}] will impact [${impactedId}] in ${timeToImpactMs}ms (Prob: ${probability})`,
    );

    return this.prisma.causalIntelligenceEdge.create({
      data: {
        tenantId,
        originAssetId: originId,
        impactedAssetId: impactedId,
        predictedImpactTimeMs: timeToImpactMs,
        causalProbability: probability,
      },
    });
  }

  /**
   * Retrieves immediate high-risk causal threats for preemptive digital twin intervention.
   */
  async fetchImminentThreats(tenantId: string, minProbability: number = 0.85) {
    this.logger.log(`Fetching imminent causal threats (Probability >= ${minProbability})`);

    return this.prisma.causalIntelligenceEdge.findMany({
      where: {
        tenantId,
        causalProbability: { gte: minProbability },
      },
      orderBy: { predictedImpactTimeMs: "asc" },
    });
  }
}
