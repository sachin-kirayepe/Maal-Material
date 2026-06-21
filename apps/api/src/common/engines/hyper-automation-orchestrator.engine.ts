import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * HyperAutomationOrchestratorEngine
 *
 * The macro orchestrator for the platform. It executes and monitors complex, multi-domain
 * automated workflows (sagas) triggered by strategic decisions or predictive forecasts.
 */
@Injectable()
export class HyperAutomationOrchestratorEngine {
  private readonly logger = new Logger(HyperAutomationOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new hyper-automation saga.
   */
  async triggerSaga(
    tenantId: string,
    sagaName: string,
    triggerSource: string,
    executionSteps: unknown[],
  ) {
    this.logger.log(`Triggering Hyper-Automation Saga [${sagaName}] via ${triggerSource}`);

    return this.prisma.hyperAutomationSaga.create({
      data: {
        tenantId,
        sagaName,
        triggerSource,
        executionSteps: JSON.stringify(executionSteps),
        status: "RUNNING",
      },
    });
  }

  /**
   * Advances a saga to the next step, or triggers compensation logic if a step fails.
   */
  async advanceSagaStep(sagaId: string, success: boolean) {
    this.logger.debug(`Advancing Saga [${sagaId}] - Previous Step Success: ${success}`);

    const saga = await this.prisma.hyperAutomationSaga.findUnique({ where: { id: sagaId } });
    if (!saga) throw new Error("Saga not found");

    if (!success) {
      this.logger.warn(`Saga [${sagaId}] Failed. Triggering ROLLBACK sequence.`);
      return this.prisma.hyperAutomationSaga.update({
        where: { id: sagaId },
        data: { status: "ROLLBACK" },
      });
    }

    const steps = JSON.parse(saga.executionSteps);
    const nextIndex = saga.currentStepIndex + 1;

    if (nextIndex >= steps.length) {
      this.logger.log(`Saga [${sagaId}] COMPLETED successfully.`);
      return this.prisma.hyperAutomationSaga.update({
        where: { id: sagaId },
        data: { status: "COMPLETED", currentStepIndex: nextIndex },
      });
    }

    // Move to next step
    return this.prisma.hyperAutomationSaga.update({
      where: { id: sagaId },
      data: { currentStepIndex: nextIndex },
    });
  }
}
