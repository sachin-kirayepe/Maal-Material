import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * AutonomousExecutionEngine — "The Execution Dispatcher" (Phase 3F)
 *
 * Manages the lifecycle of `AutonomousExecutionBlueprint` records, turning AI-proposed
 * abstract plans into deterministic operational tasks routed to downstream systems.
 */
@Injectable()
export class AutonomousExecutionEngine {
  private readonly logger = new Logger(AutonomousExecutionEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Proposes a new autonomous execution blueprint.
   */
  async proposeBlueprint(
    tenantId: string,
    blueprintName: string,
    objectiveType: string,
    executionGraph: unknown,
    confidenceScore: number,
  ) {
    this.logger.log(
      `Proposing Execution Blueprint [${blueprintName}] for Objective: ${objectiveType} (Confidence: ${confidenceScore})`,
    );

    return this.prisma.autonomousExecutionBlueprint.create({
      data: {
        tenantId,
        blueprintName,
        objectiveType,
        executionGraph: JSON.stringify(executionGraph),
        confidenceScore,
        status: "DRAFT",
      },
    });
  }

  /**
   * Moves a validated blueprint into the execution state, dispatching initial tasks.
   */
  async executeBlueprint(blueprintId: string) {
    this.logger.log(`Initiating execution for Blueprint [${blueprintId}]`);

    const blueprint = await this.prisma.autonomousExecutionBlueprint.update({
      where: { id: blueprintId },
      data: { status: "EXECUTING" },
    });

    // Fire event to begin unwinding the execution graph
    this.eventDispatcher.dispatch("orchestration", "blueprint_execution_started", {
      blueprintId,
      tenantId: blueprint.tenantId,
    });

    return blueprint;
  }

  /**
   * Aborts an active blueprint, rolling back safely if necessary.
   */
  async abortBlueprint(blueprintId: string, reason: string) {
    this.logger.warn(`Aborting Blueprint [${blueprintId}] — Reason: ${reason}`);

    return this.prisma.autonomousExecutionBlueprint.update({
      where: { id: blueprintId },
      data: { status: "ABORTED" },
    });
  }
}
