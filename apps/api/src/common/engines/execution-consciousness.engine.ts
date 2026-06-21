import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionConsciousnessEngine — "The Cognitive Auditor" (Phase 3F)
 *
 * Writes to the `ExecutionConsciousnessLog`. Detects autonomous logic loops and surfaces
 * the reasoning of the orchestration brain to human supervisors in the command center,
 * providing a transparent audit trail of why the AI made specific execution choices.
 */
@Injectable()
export class ExecutionConsciousnessEngine {
  private readonly logger = new Logger(ExecutionConsciousnessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a high-fidelity log of an autonomous decision.
   */
  async recordDecision(
    tenantId: string,
    decisionPoint: string,
    reasoning: unknown,
    actionTaken: string,
    blueprintId?: string,
  ) {
    this.logger.log(`Recording Autonomous Decision: [${actionTaken}] - ${decisionPoint}`);

    return this.prisma.executionConsciousnessLog.create({
      data: {
        tenantId,
        blueprintId,
        decisionPoint,
        reasoningJson: JSON.stringify(reasoning),
        actionTaken,
        humanOverride: false,
      },
    });
  }

  /**
   * Detects if the autonomous engine is stuck in a logic loop by checking for repeated
   * identical actions within a short time frame for the same blueprint.
   */
  async detectLogicLoop(
    tenantId: string,
    blueprintId: string,
    lookbackMinutes: number = 5,
  ): Promise<boolean> {
    const horizon = new Date();
    horizon.setMinutes(horizon.getMinutes() - lookbackMinutes);

    const recentLogs = await this.prisma.executionConsciousnessLog.findMany({
      where: {
        tenantId,
        blueprintId,
        timestamp: { gte: horizon },
      },
      orderBy: { timestamp: "desc" },
    });

    if (recentLogs.length < 5) return false;

    // Check if the last 5 actions are exactly the same
    const lastAction = recentLogs![0]!.actionTaken;
    const isLooping = recentLogs.slice(0, 5).every((log) => log.actionTaken === lastAction);

    if (isLooping) {
      this.logger.error(
        `Critical: Autonomous Logic Loop detected in Blueprint [${blueprintId}]. Action [${lastAction}] repeated 5 times. Escalate to Human.`,
      );
    }

    return isLooping;
  }

  /**
   * Registers a human override, effectively vetoing the autonomous path.
   */
  async registerHumanOverride(logId: string) {
    this.logger.warn(`Human Override invoked for Decision Log [${logId}]`);

    return this.prisma.executionConsciousnessLog.update({
      where: { id: logId },
      data: { humanOverride: true },
    });
  }
}
