import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * NeuralSynchronizationEngine — "The Enterprise Consciousness" (Phase 3J)
 *
 * Processes raw `CognitiveSignal` data into a coherent, synchronized
 * `NeuralSynchronizationState`. Ensures all autonomous agents and workflows
 * within the ecosystem are reacting to the exact same "operational reality."
 */
@Injectable()
export class NeuralSynchronizationEngine {
  private readonly logger = new Logger(NeuralSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregates a batch of cognitive signals into a synchronized state for a specific domain.
   */
  async synchronizeDomainReality(tenantId: string, domain: string, signals: unknown[]) {
    this.logger.log(
      `Synchronizing Neural Reality for Domain: [${domain}]. Signals: ${signals.length}`,
    );

    // Generate a deterministic hash representing the collective state
    const signalPayloads = signals.map((s) => JSON.parse((s as any).payloadJson));
    const rawStateString = JSON.stringify(signalPayloads);
    const consensusHash = crypto.createHash("sha256").update(rawStateString).digest("hex");

    // Calculate a basic confidence score based on signal velocity/consistency
    const confidenceScore = signals.length > 50 ? 0.95 : 0.8; // Stub logic

    // Upsert the domain's synchronized state
    const existingState = await this.prisma.neuralSynchronizationState.findFirst({
      where: { tenantId, domain },
    });

    if (existingState) {
      return this.prisma.neuralSynchronizationState.update({
        where: { id: existingState.id },
        data: {
          consensusHash,
          stateJson: rawStateString,
          confidenceScore,
        },
      });
    } else {
      return this.prisma.neuralSynchronizationState.create({
        data: {
          tenantId,
          domain,
          consensusHash,
          stateJson: rawStateString,
          confidenceScore,
        },
      });
    }
  }

  /**
   * Exposes the current synchronous state for downstream autonomous agents to query.
   */
  async getCurrentConsciousness(tenantId: string, domain: string) {
    return this.prisma.neuralSynchronizationState.findFirst({
      where: { tenantId, domain },
      orderBy: { updatedAt: "desc" },
    });
  }
}
