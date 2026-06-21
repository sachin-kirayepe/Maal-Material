import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkflowDecisionEngine — "The Dynamic Router" (Phase 3X)
 *
 * Synthesizes and resolves WorkflowDecisionNode records, intelligently steering
 * live operations through optimal paths based on current ecosystem friction.
 */
@Injectable()
export class WorkflowDecisionEngine {
  private readonly logger = new Logger(WorkflowDecisionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a dynamic decision gate where an execution flow must adapt.
   */
  async formulateDecisionNode(
    tenantId: string,
    zone: string,
    contextState: unknown,
    decisionPath: string,
    confidence: number,
  ) {
    this.logger.debug(
      `Formulating Workflow Decision [Zone: ${zone}] [Path: ${decisionPath}] [Confidence: ${confidence}]`,
    );

    return this.prisma.workflowDecisionNode.create({
      data: {
        tenantId,
        workflowZone: zone,
        contextStateJson: JSON.stringify(contextState),
        decisionPath,
        confidenceScore: confidence,
      },
    });
  }

  /**
   * Evaluates the best routing path for a highly congested workflow zone.
   */
  async resolveWorkflowPath(tenantId: string, zone: string) {
    this.logger.log(`Resolving optimal workflow path for zone: ${zone}`);

    const nodes = await this.prisma.workflowDecisionNode.findMany({
      where: { tenantId, workflowZone: zone },
      orderBy: { confidenceScore: "desc" },
      take: 5,
    });

    if (nodes.length === 0) return null;

    // Return the highest-confidence historic adaptation path for this zone
    return nodes![0]!.decisionPath;
  }
}
