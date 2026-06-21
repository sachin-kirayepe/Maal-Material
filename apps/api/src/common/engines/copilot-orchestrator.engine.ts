import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * CopilotOrchestratorEngine
 *
 * Bridges the gap between the frontend AI Copilot UI and the backend
 * automation/transactional systems. When the Copilot suggests an action
 * (e.g. "Draft PO") and the user approves it, this engine logs the intent
 * and dispatches it securely to the respective domain engine.
 */
@Injectable()
export class CopilotOrchestratorEngine {
  private readonly logger = new Logger(CopilotOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Registers a new intent that the AI Copilot wants to execute.
   */
  async registerCopilotIntent(
    tenantId: string,
    userId: string,
    intentType: string,
    contextJson: unknown,
    confidenceScore: number,
  ) {
    this.logger.log(
      `Registering Copilot Intent: ${intentType} for user ${userId} (Tenant: ${tenantId})`,
    );

    const intent = await this.prisma.copilotActionIntent.create({
      data: {
        tenantId,
        userId,
        intentType,
        contextJson: JSON.stringify(contextJson),
        confidenceScore,
        status: "PENDING",
      },
    });

    return intent;
  }

  /**
   * Executes an intent after explicit user approval.
   */
  async executeIntent(tenantId: string, userId: string, intentId: string) {
    this.logger.log(`Executing approved Copilot Intent: ${intentId}`);

    const intent = await this.prisma.copilotActionIntent.findUnique({ where: { id: intentId } });
    if (!intent || intent.tenantId !== tenantId || intent.status !== "PENDING") {
      throw new Error("Invalid or already executed intent");
    }

    // Mark as executed
    const updated = await this.prisma.copilotActionIntent.update({
      where: { id: intent.id },
      data: { status: "EXECUTED", userFeedback: "APPROVED" },
    });

    // Dispatch the intent to the automation layer.
    // E.g., The BusinessRuleEngine or UniversalOrchestrationEngine listens to 'copilot.intent_executed'
    this.eventDispatcher.dispatch("automation", "copilot_intent_executed", {
      tenantId,
      userId,
      intentType: intent.intentType,
      contextJson: JSON.parse(intent.contextJson),
    });

    return updated;
  }
}
