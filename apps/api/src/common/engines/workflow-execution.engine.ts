import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { WorkflowBlueprintEngine } from "./workflow-blueprint.engine";

/**
 * WorkflowExecutionEngine — "The Pipeline Orchestrator"
 *
 * Instantiates execution runs, traverses the DAG, and manages the
 * state machine for overall workflow progression.
 */
@Injectable()
export class WorkflowExecutionEngine {
  private readonly logger = new Logger(WorkflowExecutionEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly blueprintEngine: WorkflowBlueprintEngine,
  ) {}

  /**
   * Starts a new execution run from an active blueprint.
   */
  async startExecution(
    tenantId: string,
    blueprintName: string,
    initialContext: Record<string, any>,
  ) {
    const blueprint = await this.blueprintEngine.getActiveBlueprint(tenantId, blueprintName);

    if (!blueprint) {
      throw new Error(`Active blueprint [${blueprintName}] not found.`);
    }

    this.logger.log(`Starting execution run for [${blueprintName}] v${blueprint.version}`);

    return this.prisma.workflowExecutionRun.create({
      data: {
        tenantId,
        blueprintId: blueprint.id,
        contextData: JSON.stringify(initialContext),
        status: "RUNNING",
      },
    });
  }

  /**
   * Transitions a workflow to COMPLETION or FAILURE based on DAG traversal status.
   */
  async terminateExecution(runId: string, status: "COMPLETED" | "FAILED") {
    this.logger.log(`Terminating execution run [${runId}] as ${status}`);

    return this.prisma.workflowExecutionRun.update({
      where: { id: runId },
      data: {
        status,
        completedAt: new Date(),
      },
    });
  }
}
