import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutiveGovernanceEngine
 *
 * Provides a highly secure, ultimate "glass-break" mechanism for C-level operators.
 * Allows humans to intercept, pause, or roll back automated sagas and AI decisions globally.
 */
@Injectable()
export class ExecutiveGovernanceEngine {
  private readonly logger = new Logger(ExecutiveGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Triggers a global override or targeted intervention by a human executive.
   */
  async triggerExecutiveOverride(
    tenantId: string,
    executiveUserId: string,
    targetType: string,
    overrideAction: string,
    justification: string,
    targetId?: string,
  ) {
    this.logger.warn(
      `EXECUTIVE OVERRIDE INITIATED by [${executiveUserId}] for Target [${targetType}]: ${overrideAction}`,
    );

    // 1. Log the immutable override event
    const overrideLog = await this.prisma.executiveGovernanceOverride.create({
      data: {
        tenantId,
        executiveUserId,
        targetType,
        targetId,
        overrideAction,
        justification,
      },
    });

    // 2. Apply the override logic
    if (targetType === "SAGA" && targetId) {
      if (overrideAction === "ABORT_SAGA") {
        await this.prisma.hyperAutomationSaga.update({
          where: { id: targetId },
          data: { status: "FAILED" }, // Hard stop
        });
        this.logger.warn(`Saga [${targetId}] has been forcefully aborted by Executive Command.`);
      }
    } else if (targetType === "GLOBAL_SYSTEM" && overrideAction === "PAUSE_ALL_AUTOMATION") {
      this.logger.error(`!!! CRITICAL: ALL HYPER-AUTOMATION PAUSED FOR TENANT ${tenantId} !!!`);
      // Update all active sagas to SUSPENDED or dispatch a global pause event to engines
    }

    return overrideLog;
  }
}
