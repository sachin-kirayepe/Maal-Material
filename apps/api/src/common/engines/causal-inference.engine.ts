import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CausalInferenceEngine — "The Explainer"
 *
 * Constructs and traverses cause→effect chains across operational events.
 * Provides human-readable explanations of cascading failures or successes.
 */
@Injectable()
export class CausalInferenceEngine {
  private readonly logger = new Logger(CausalInferenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Constructs a new causal inference chain from a set of cause events leading to effect events.
   */
  async buildCausalChain(
    tenantId: string,
    chainName: string,
    causeEvents: Array<{ eventType: string; eventId: string; timestamp: string }>,
    effectEvents: Array<{ eventType: string; eventId: string; timestamp: string }>,
    explanation: string,
    confidenceScore: number = 0.5,
  ) {
    this.logger.log(
      `Building Causal Chain: [${chainName}] (${causeEvents.length} causes → ${effectEvents.length} effects)`,
    );

    return this.prisma.causalInferenceChain.create({
      data: {
        tenantId,
        chainName,
        causeEvents: JSON.stringify(causeEvents),
        effectEvents: JSON.stringify(effectEvents),
        explanation,
        confidenceScore,
      },
    });
  }

  /**
   * Retrieves all causal chains for a tenant, optionally filtered by minimum confidence.
   */
  async getCausalChains(tenantId: string, minConfidence: number = 0.0) {
    return this.prisma.causalInferenceChain.findMany({
      where: {
        tenantId,
        confidenceScore: { gte: minConfidence },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Searches for causal chains where a specific event appears as either a cause or effect.
   */
  async findChainsInvolvingEvent(tenantId: string, eventId: string) {
    this.logger.debug(`Searching causal chains involving event [${eventId}]`);

    // Uses JSON string search — in production, use full-text or JSON column queries
    const chains = await this.prisma.causalInferenceChain.findMany({
      where: {
        tenantId,
        OR: [{ causeEvents: { contains: eventId } }, { effectEvents: { contains: eventId } }],
      },
      orderBy: { confidenceScore: "desc" },
    });

    this.logger.log(`Found ${chains.length} causal chains involving event [${eventId}].`);
    return chains;
  }
}
