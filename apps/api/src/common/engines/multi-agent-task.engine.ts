import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MultiAgentTaskEngine — "The Execution Delegate" (Phase 7A)
 *
 * Synchronizes MultiAgentExecutionTasks. Monitors the lifecycle, success, retries,
 * and failures of delegated multi-agent workflows.
 */
@Injectable()
export class MultiAgentTaskEngine {
  private readonly logger = new Logger(MultiAgentTaskEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dispatches a highly-autonomous execution objective to a specific agent.
   */
  async delegateObjectiveToAgent(
    tenantId: string,
    agentId: string,
    domain: string,
    objectiveJson: unknown,
  ) {
    this.logger.log(`Delegating Autonomous Objective: [Agent: ${agentId}] [Domain: ${domain}]`);

    return this.prisma.multiAgentExecutionTask.create({
      data: {
        tenantId,
        assigneeAgentId: agentId,
        taskDomain: domain,
        objectivePayloadJson: JSON.stringify(objectiveJson),
        taskStatus: "PENDING",
      },
    });
  }

  /**
   * Tracks the execution lifecycle of the delegated objective.
   */
  async reportTaskProgress(taskId: string, status: string) {
    this.logger.debug(`Task [${taskId}] progressed to: ${status}`);

    return this.prisma.multiAgentExecutionTask.update({
      where: { id: taskId },
      data: { taskStatus: status },
    });
  }
}
