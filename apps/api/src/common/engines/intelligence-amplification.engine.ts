import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IntelligenceAmplificationEngine — "The Cross-Domain Synapse" (Phase 4A)
 *
 * Synchronizes IntelligenceAmplificationEdges, propagating local domain insights
 * globally to amplify total civilization-scale intelligence.
 */
@Injectable()
export class IntelligenceAmplificationEngine {
  private readonly logger = new Logger(IntelligenceAmplificationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transfers a learned insight from one operational domain to another.
   */
  async propagateInsight(
    tenantId: string,
    sourceDomain: string,
    targetDomain: string,
    insight: unknown,
    multiplier: number,
  ) {
    this.logger.log(
      `Propagating Intelligence [${sourceDomain} -> ${targetDomain}] [Multiplier: x${multiplier}]`,
    );

    return this.prisma.intelligenceAmplificationEdge.create({
      data: {
        tenantId,
        sourceDomain,
        targetDomain,
        transferredInsightJson: JSON.stringify(insight),
        amplificationMultiplier: multiplier,
      },
    });
  }

  /**
   * Calculates the compound intelligence gain achieved through cross-domain learning.
   */
  async calculateCompoundIntelligence(tenantId: string) {
    this.logger.debug(`Calculating Compound Intelligence Amplification...`);

    const edges = await this.prisma.intelligenceAmplificationEdge.findMany({
      where: { tenantId },
    });

    let totalMultiplier = 1.0;
    for (const edge of edges) {
      // Compound the multipliers to estimate total algorithmic improvement
      totalMultiplier *= 1 + edge.amplificationMultiplier / 100;
    }

    this.logger.log(`Total Intelligence Amplification Multiplier: x${totalMultiplier.toFixed(3)}`);
    return totalMultiplier;
  }
}
