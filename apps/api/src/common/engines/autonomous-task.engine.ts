import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AutonomousTaskEngine — "The Execution Node"
 *
 * Orchestrates individual workflow tasks. Supports routing tasks
 * to human operators or safely executing them via AI agents.
 */
@Injectable()
export class AutonomousTaskEngine {
  private readonly logger = new Logger(AutonomousTaskEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Spawns a new task within a workflow execution run.
   */
  async spawnTask(
    tenantId: string,
    executionRunId: string,
    nodeId: string,
    taskType: string,
    inputPayload: Record<string, any>,
  ) {
    this.logger.log(`Spawning Task [${nodeId}] of type [${taskType}] for Run [${executionRunId}]`);

    return this.prisma.autonomousExecutionTask.create({
      data: {
        tenantId,
        executionRunId,
        nodeId,
        taskType,
        inputPayload: JSON.stringify(inputPayload),
        status: "PENDING",
      },
    });
  }

  /**
   * Records the completion of an autonomous AI task or human task.
   */
  async completeTask(taskId: string, outputPayload: Record<string, any>, confidenceScore?: number) {
    this.logger.debug(`Completing Task [${taskId}] with confidence ${confidenceScore}`);

    return this.prisma.autonomousExecutionTask.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
        outputPayload: JSON.stringify(outputPayload),
        confidenceScore,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Escalates a task to human intervention due to low AI confidence or governance block.
   */
  async escalateTask(taskId: string, reason: string) {
    this.logger.warn(`Escalating Task [${taskId}]: ${reason}`);

    return this.prisma.autonomousExecutionTask.update({
      where: { id: taskId },
      data: { status: "ESCALATED" },
    });
  }
}
