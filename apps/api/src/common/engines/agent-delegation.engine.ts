import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AgentDelegationEngine
 *
 * Facilitates safe, tracked communication between specialized AI agents.
 * For example, if the ProcurementBot decides an item is needed, it delegates
 * a budget check to the FinanceBot using this engine.
 */
@Injectable()
export class AgentDelegationEngine {
  private readonly logger = new Logger(AgentDelegationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delegates a sub-task from one AI agent to another.
   */
  async delegateTask(
    tenantId: string,
    delegatorAgentId: string,
    delegateeAgentId: string,
    taskId: string,
    payload: unknown,
  ) {
    this.logger.log(
      `Agent Delegation: [${delegatorAgentId}] handing off task ${taskId} to [${delegateeAgentId}]`,
    );

    return this.prisma.aIAgentDelegation.create({
      data: {
        tenantId,
        delegatorAgentId,
        delegateeAgentId,
        taskId,
        payloadJson: JSON.stringify(payload),
        status: "PENDING",
      },
    });
  }

  /**
   * Resolves an active delegation task back to the originating agent.
   */
  async resolveDelegation(delegationId: string, success: boolean) {
    this.logger.debug(`Resolving Agent Delegation [${delegationId}] -> Success: ${success}`);

    return this.prisma.aIAgentDelegation.update({
      where: { id: delegationId },
      data: {
        status: success ? "COMPLETED" : "FAILED",
        completedAt: new Date(),
      },
    });
  }
}
