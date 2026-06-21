import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";
import { KnowledgeGraphEngine } from "./knowledge-graph.engine";

/**
 * DecisionIntelligenceEngine
 *
 * Acts as the centralized reasoning layer for the platform. It consumes
 * data from the Knowledge Graph, Telemetry Streams, and Trust systems to
 * output high-confidence operational decisions, and safely logs them for audit.
 */
@Injectable()
export class DecisionIntelligenceEngine {
  private readonly logger = new Logger(DecisionIntelligenceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
    private readonly kgEngine: KnowledgeGraphEngine,
  ) {}

  /**
   * Generates a complex operational decision.
   * E.g., deciding whether to automatically re-route logistics based on
   * weather anomalies and contractor trust scores.
   */
  async generateDecision(
    tenantId: string,
    decisionType: string,
    entityType: string,
    entityId: string,
    context: unknown,
  ) {
    this.logger.log(`Generating AI Decision [${decisionType}] for ${entityType}:${entityId}`);

    // In a production AI setting, this would call an internal ML Model or LLM Endpoint.
    // For now, we simulate the inference logic using simple heuristics based on KG context.

    // Check if there's a strong negative relationship (e.g. VENDOR -> FREQUENTLY_DELAYS)
    const delayRisk = await this.kgEngine.findRelatedEntities(
      tenantId,
      entityType,
      entityId,
      "FREQUENTLY_DELAYS",
    );

    let suggestedAction = "PROCEED";
    let confidence = 0.85;

    if (delayRisk.length > 0) {
      suggestedAction = "RE_ROUTE_SUPPLY";
      confidence = 0.92;
    }

    const decisionLog = await this.prisma.decisionIntelligenceLog.create({
      data: {
        tenantId,
        decisionType,
        entityType,
        entityId,
        decisionContext: JSON.stringify(context),
        suggestedAction,
        confidenceScore: confidence,
        executed: false, // Wait for Copilot approval or auto-execute if highly confident
      },
    });

    this.eventDispatcher.dispatch("intelligence", "decision_generated", {
      tenantId,
      decisionId: decisionLog.id,
      suggestedAction,
    });

    return decisionLog;
  }
}
