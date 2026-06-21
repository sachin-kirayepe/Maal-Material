import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * AdaptiveWorkflowOrchestratorEngine
 *
 * Provides cross-industry workflow intelligence.
 * Instead of hardcoding steps like "Hire Subcontractor" or "Dispatch Truck",
 * this engine loads an industry-agnostic UniversalWorkflowTemplate
 * and adapts it into executable tasks at runtime.
 */
@Injectable()
export class AdaptiveWorkflowOrchestratorEngine {
  private readonly logger = new Logger(AdaptiveWorkflowOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Instantiates a universal workflow template into an active execution.
   */
  async triggerWorkflow(tenantId: string, workflowName: string, contextPayload: unknown) {
    this.logger.log(`Triggering Universal Workflow [${workflowName}]`);

    const template = await this.prisma.universalWorkflowTemplate.findFirst({
      where: { tenantId, workflowName, isActive: true },
    });

    if (!template) {
      throw new Error(`Workflow template ${workflowName} not found.`);
    }

    const steps = JSON.parse(template.stepsJson);
    this.logger.debug(`Found ${steps.length} steps in workflow template.`);

    // Dispatch the first step to the standard execution engine
    if (steps.length > 0) {
      this.eventDispatcher.dispatch("workflow", "step_initiated", {
        tenantId,
        workflowName,
        stepName: steps[0].stepName,
        contextPayload,
      });
    }

    return { status: "STARTED", stepsCount: steps.length };
  }
}
