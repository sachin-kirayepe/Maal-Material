import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";

/**
 * UniversalOrchestrationEngine
 *
 * Reusable enterprise engine for handling Work Orders, Commerce Orders, Projects, and Fulfillment.
 * Decoupled from construction-specific processes (like BOQ or specific site operations).
 * Acts as the domain-agnostic layer for future Hyperlocal and Universal Commerce ecosystems.
 */
@Injectable()
export class UniversalOrchestrationEngine {
  private readonly logger = new Logger(UniversalOrchestrationEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
  ) {}

  /**
   * Universal project/order initialization
   * Replaces legacy ConstructionProject creation logic with a universal interface
   */
  async initializeCommerceProject(params: {
    tenantId: string;
    name: string;
    code: string;
    budget: number;
    startDate: Date;
    estimatedEndDate: Date;
  }) {
    this.logger.log(`Initializing universal commerce project/workflow: ${params.code}`);

    // Dynamically validate that this tenant is allowed to use complex orchestration features
    await this.capabilityEngine.requireCapability(params.tenantId, "ADVANCED_ORCHESTRATION");

    // Create using the newly abstracted generic Prisma accessor
    // This safely saves to the legacy 'construction_projects' table under the hood
    const project = await this.prisma.commerceProject.create({
      data: {
        tenantId: params.tenantId,
        name: params.name,
        code: params.code,
        budget: params.budget,
        startDate: params.startDate,
        estimatedEndDate: params.estimatedEndDate,
        status: "PLANNING",
      },
    });

    // Dispatch a universal domain event
    this.eventDispatcher.dispatch("orchestration", "project_initialized", {
      projectId: project.id,
      code: project.code,
      status: project.status,
    });

    return project;
  }
}
