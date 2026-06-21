import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkforceSynchronizationEngine — "The Field Dispatcher" (Phase 10)
 *
 * Harmonizes AI-agent orchestration with human labor, safely bridging the gap
 * between digital decision-making and physical execution constraints.
 */
@Injectable()
export class WorkforceSynchronizationEngine {
  private readonly logger = new Logger(WorkforceSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dispatches a human or hybrid execution task based on a digital-twin trigger.
   */
  async dispatchFieldTask(
    tenantId: string,
    executionNodeId: string,
    assignedWorkerId: string,
    contextPayload: unknown,
  ) {
    this.logger.log(
      `Dispatching Physical Workforce Task to [${assignedWorkerId}] from Digital Node [${executionNodeId}]`,
    );

    return this.prisma.workforceSynchronizationTask.create({
      data: {
        tenantId,
        assignedWorkerId,
        executionNodeId,
        executionContext: JSON.stringify(contextPayload),
        status: "DISPATCHED",
      },
    });
  }

  /**
   * Called via mobile-app or edge-device when a human completes the physical act.
   */
  async markTaskCompleted(taskId: string): Promise<boolean> {
    this.logger.debug(`Worker acknowledged completion of physical task [${taskId}]`);

    const task = await this.prisma.workforceSynchronizationTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      this.logger.error(`Failed to complete task: Task ID [${taskId}] not found.`);
      return false;
    }

    await this.prisma.workforceSynchronizationTask.update({
      where: { id: taskId },
      data: { status: "COMPLETED" },
    });

    return true;
  }
}
