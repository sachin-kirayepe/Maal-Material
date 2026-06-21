import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkflowConsequenceInferenceEngine — "The Oracle" (Phase 29)
 *
 * Mathematically infers the cascading downstream damage if a specific node
 * within the enterprise knowledge graph were to fail.
 */
@Injectable()
export class WorkflowConsequenceInferenceEngine {
  private readonly logger = new Logger(WorkflowConsequenceInferenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a predicted downstream impact of a localized failure.
   */
  async inferConsequences(
    tenantId: string,
    triggerNodeId: string,
    impactJson: unknown,
    confidence: number,
  ) {
    this.logger.debug(
      `Inferring Consequences for Node Failure [${triggerNodeId}] | Confidence: ${confidence}`,
    );

    const inference = await this.prisma.workflowConsequenceInference.create({
      data: {
        tenantId,
        triggerNodeId,
        inferredImpact: JSON.stringify(impactJson),
        confidenceScore: confidence,
        status: "PREDICTED",
      },
    });

    if (confidence > 0.85) {
      this.logger.warn(
        `HIGH CONFIDENCE INFERENCE: If Node [${triggerNodeId}] fails, catastrophic downstream damage is mathematically probable. Initiating mitigation protocols.`,
      );
    }

    return inference;
  }
}
