import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";
import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";

/**
 * WorkforceOrchestratorEngine
 *
 * Handles intelligent workforce scheduling, dispatch, and availability
 * across any industry — not just construction.
 *
 * Provides reusable abstractions for:
 * - Workforce availability checking
 * - Skill-based matching
 * - Attendance orchestration
 * - Future AI-driven dispatch recommendations
 */
@Injectable()
export class WorkforceOrchestratorEngine {
  private readonly logger = new Logger(WorkforceOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
  ) {}

  /**
   * Find available workforce members matching specific skill requirements.
   * This is the foundational method for future AI-powered workforce matching.
   */
  async findAvailableBySkill(params: {
    tenantId: string;
    skillType: string;
    date: Date;
    excludeProjectId?: string;
  }) {
    this.logger.debug(
      `Finding available ${params.skillType} workforce for ${params.date.toISOString()}`,
    );

    // Ensure tenant has workforce capability
    await this.capabilityEngine.requireCapability(params.tenantId, "WORKFORCE");

    // Find active workforce with the requested skill
    const workforce = await this.prisma.ecosystemWorkforce.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        skillType: params.skillType,
        ...(params.excludeProjectId ? { projectId: { not: params.excludeProjectId } } : {}),
      },
      orderBy: { dailyWage: "asc" },
    });

    // Check which ones are NOT already assigned on the requested date
    const assignedWorkerIds = (
      await this.prisma.workforceAttendance.findMany({
        where: {
          date: params.date,
          status: "PRESENT",
          workerId: { in: workforce.map((w) => w.id) },
        },
        select: { workerId: true },
      })
    ).map((a) => a.workerId);

    const available = workforce.filter((w) => !assignedWorkerIds.includes(w.id));

    return {
      total: workforce.length,
      available: available.length,
      workers: available,
    };
  }

  /**
   * Dispatch a workforce member to a specific project/site.
   * Fires a domain event for downstream orchestration.
   */
  async dispatchToProject(params: { tenantId: string; workforceId: string; projectId: string }) {
    this.logger.log(`Dispatching workforce ${params.workforceId} to project ${params.projectId}`);

    const worker = await this.prisma.ecosystemWorkforce.findUnique({
      where: { id: params.workforceId },
    });

    if (!worker || !worker.isActive) {
      throw new NotFoundException(`Workforce member ${params.workforceId} not found or inactive`);
    }

    const updated = await this.prisma.ecosystemWorkforce.update({
      where: { id: params.workforceId },
      data: { projectId: params.projectId },
    });

    this.eventDispatcher.dispatch("workforce", "dispatched", {
      workforceId: updated.id,
      projectId: params.projectId,
      skillType: updated.skillType,
    });

    return updated;
  }
}
