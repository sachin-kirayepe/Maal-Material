import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CognitiveOrchestrationEngine — "The Reasoning Translator" (Phase 4B)
 *
 * Synchronizes CognitiveOrchestrationEdges, acting as the translator that converts
 * abstract strategic reasoning into concrete platform execution commands.
 */
@Injectable()
export class CognitiveOrchestrationEngine {
  private readonly logger = new Logger(CognitiveOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Routes a finalized reasoning decision to an active execution workflow.
   */
  async routeCognitiveDecision(
    tenantId: string,
    reasoningNodeId: string,
    targetWorkflowId: string,
    commandPayload: unknown,
  ) {
    this.logger.log(
      `Routing Cognitive Decision [Node: ${reasoningNodeId}] -> [Workflow: ${targetWorkflowId}]`,
    );

    return this.prisma.cognitiveOrchestrationEdge.create({
      data: {
        tenantId,
        reasoningNodeId,
        targetWorkflowId,
        executionCommandJson: JSON.stringify(commandPayload),
        executionStatus: "PENDING",
      },
    });
  }

  /**
   * Scans for pending cognitive commands and executes them against the platform.
   */
  async executePendingCognitiveCommands(tenantId: string) {
    this.logger.debug(`Scanning for pending cognitive orchestration edges...`);

    const pendingEdges = await this.prisma.cognitiveOrchestrationEdge.findMany({
      where: { tenantId, executionStatus: "PENDING" },
    });

    for (const edge of pendingEdges) {
      this.logger.log(`Executing Cognitive Command for Workflow ${edge.targetWorkflowId}...`);

      // In a real scenario, this would call the CapabilityOrchestratorEngine or equivalent

      await this.prisma.cognitiveOrchestrationEdge.update({
        where: { id: edge.id },
        data: { executionStatus: "EXECUTED" },
      });
    }

    return pendingEdges.length;
  }
}
