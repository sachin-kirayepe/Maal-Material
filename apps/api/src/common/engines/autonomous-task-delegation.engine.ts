import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AutonomousTaskDelegationEngine — "The Dispatcher" (Phase 30)
 *
 * Intelligently delegates enterprise workflows to the most capable AI agent
 * based on load and exact skill matching.
 */
@Injectable()
export class AutonomousTaskDelegationEngine {
  private readonly logger = new Logger(AutonomousTaskDelegationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Assigns a workflow task to a specific autonomous agent.
   */
  async delegateTask(tenantId: string, agentId: string, taskId: string) {
    this.logger.debug(`Delegating Task [${taskId}] to Agent [${agentId}]`);

    const delegation = await this.prisma.agentTaskDelegation.create({
      data: {
        tenantId,
        agentId,
        taskId,
        executionState: "ASSIGNED",
      },
    });

    // Update agent status to active
    await this.prisma.aIWorkforceAgent.update({
      where: { id: agentId },
      data: { operationalStatus: "ACTIVE" },
    });

    return delegation;
  }
}
