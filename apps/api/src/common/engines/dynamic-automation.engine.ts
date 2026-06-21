import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DynamicAutomationEngine — "The Execution Dispatcher" (Phase 3I)
 *
 * Executes the micro-steps (`HyperAutomationAction`) of a running process
 * by dispatching them to the autonomous execution grid and verified execution engines.
 */
@Injectable()
export class DynamicAutomationEngine {
  private readonly logger = new Logger(DynamicAutomationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dispatches a modular automation action into the enterprise grid.
   */
  async dispatchAction(tenantId: string, instanceId: string, actionType: string, payload: unknown) {
    this.logger.log(`Dispatching Automation Action: [${actionType}] for Instance [${instanceId}]`);

    // Creates the action in a PENDING state to be picked up by worker nodes
    return this.prisma.hyperAutomationAction.create({
      data: {
        tenantId,
        instanceId,
        actionType,
        status: "PENDING",
        payloadJson: JSON.stringify(payload),
      },
    });
  }

  /**
   * Records the result of an executed automation action, triggering subsequent steps.
   */
  async recordActionResult(actionId: string, result: unknown, isSuccess: boolean) {
    this.logger.debug(`Recording Action Result for Action [${actionId}]. Success: ${isSuccess}`);

    return this.prisma.hyperAutomationAction.update({
      where: { id: actionId },
      data: {
        status: isSuccess ? "EXECUTED" : "FAILED",
        resultJson: JSON.stringify(result),
        executedAt: new Date(),
      },
    });
  }
}
