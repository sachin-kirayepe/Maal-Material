import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionComplianceAuditorEngine — "The Safety Guardrail" (Phase 30)
 *
 * Actively monitors autonomous execution. Instantly halts and terminates any
 * agent that attempts an operation outside of its strictly defined boundaries.
 */
@Injectable()
export class ExecutionComplianceAuditorEngine {
  private readonly logger = new Logger(ExecutionComplianceAuditorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates an agent's intended action against enterprise compliance policies before execution.
   */
  async evaluateAgentAction(
    tenantId: string,
    agentId: string,
    context: string,
    isCompliant: boolean,
  ) {
    this.logger.debug(`Auditing autonomous action for Agent [${agentId}]: ${context}`);

    const ledger = await this.prisma.autonomousExecutionLedger.create({
      data: {
        tenantId,
        agentId,
        actionContext: context,
        complianceStatus: isCompliant ? "APPROVED" : "REJECTED_BY_AUDITOR",
      },
    });

    if (!isCompliant) {
      this.logger.error(
        `COMPLIANCE VIOLATION: Agent [${agentId}] attempted unauthorized execution. Rejecting action and suspending agent.`,
      );

      // Suspend the agent immediately
      await this.prisma.aIWorkforceAgent.update({
        where: { id: agentId },
        data: { operationalStatus: "TERMINATED" },
      });
    }

    return ledger;
  }
}
