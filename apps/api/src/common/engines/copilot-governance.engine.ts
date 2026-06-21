import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CopilotGovernanceEngine — "The Human-in-the-Loop Sentinel" (Phase 5A)
 *
 * Enforces CopilotGovernanceCircuit constraints. Evaluates the risk profile of the AI's
 * intended assistance and strictly enforces human oversight for high-risk operations.
 */
@Injectable()
export class CopilotGovernanceEngine {
  private readonly logger = new Logger(CopilotGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a governance circuit for the AI Copilot.
   */
  async registerCopilotCircuit(
    tenantId: string,
    domain: string,
    requiresHuman: boolean,
    maxRiskLevel: number,
  ) {
    this.logger.log(
      `Registering Copilot Governance Circuit: [${domain}] [Max Autonomous Risk: ${maxRiskLevel}/10]`,
    );

    return this.prisma.copilotGovernanceCircuit.create({
      data: {
        tenantId,
        assistanceDomain: domain,
        requiresHumanInTheLoop: requiresHuman,
        maxAutonomousRiskLevel: maxRiskLevel,
      },
    });
  }

  /**
   * Validates if the Copilot can execute an action autonomously or if it must remain a draft for human approval.
   */
  async validateAutonomousExecution(
    tenantId: string,
    domain: string,
    actionRiskLevel: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Copilot Autonomous Execution [Domain: ${domain}] [Risk Level: ${actionRiskLevel}/10]`,
    );

    const circuits = await this.prisma.copilotGovernanceCircuit.findMany({
      where: { tenantId, assistanceDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No copilot governance circuit found for ${domain}. Defaulting to STRICT reject. Human-in-the-loop required.`,
      );
      return false; // Fail-secure. AI can only draft, never execute.
    }

    for (const circuit of circuits) {
      if (circuit.requiresHumanInTheLoop) {
        this.logger.warn(
          `Copilot Governance: Domain ${domain} strictly requires Human-in-the-Loop. Autonomous execution BLOCKED.`,
        );
        return false;
      }

      if (actionRiskLevel > circuit.maxAutonomousRiskLevel) {
        this.logger.error(
          `CRITICAL: Action risk level (${actionRiskLevel}/10) exceeds Autonomous limit (${circuit.maxAutonomousRiskLevel}/10). PREVENTING AI EXECUTION.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Copilot Governance: Action risk validated. Autonomous execution by Copilot approved.`,
    );
    return true; // The AI is safe to execute the action without human intervention
  }
}
