import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * SLAOrchestratorEngine
 *
 * Monitors SLA definitions and detects breaches.
 * When a domain event fires, this engine checks if there is a corresponding
 * SLADefinition. If the deadline expires without a resolution event, it
 * generates an SLA breach alert and triggers escalation.
 */
@Injectable()
export class SLAOrchestratorEngine {
  private readonly logger = new Logger(SLAOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Called when a domain event fires. Records the SLA clock start
   * and schedules a future check.
   */
  async trackSLAForEvent(tenantId: string, triggerEvent: string, referenceId: string) {
    const slaDefinitions = await this.prisma.sLADefinition.findMany({
      where: { tenantId, triggerEvent, isActive: true },
    });

    for (const sla of slaDefinitions) {
      this.logger.log(
        `SLA tracking started: "${sla.name}" for ${triggerEvent} (ref: ${referenceId}). Deadline: ${sla.deadlineHours}h`,
      );

      // Dispatch a delayed check event (in production, this would be a BullMQ delayed job)
      this.eventDispatcher.dispatch("automation", "sla_clock_started", {
        slaId: sla.id,
        slaName: sla.name,
        referenceId,
        triggerEvent,
        deadlineHours: sla.deadlineHours,
        warningHours: sla.warningHours,
        escalateToRole: sla.escalateToRole,
      });

      // If there is a warning window, dispatch an early warning too
      if (sla.warningHours && sla.warningHours < sla.deadlineHours) {
        this.eventDispatcher.dispatch("automation", "sla_warning_scheduled", {
          slaId: sla.id,
          referenceId,
          warningHours: sla.warningHours,
        });
      }
    }

    return slaDefinitions.length;
  }

  /**
   * Called when the SLA deadline timer fires.
   * Checks if the corresponding resolution event has occurred.
   * If not, generates a breach.
   */
  async checkSLABreach(params: {
    tenantId: string;
    slaId: string;
    referenceId: string;
    resolved: boolean;
  }) {
    if (params.resolved) {
      this.logger.log(
        `SLA ${params.slaId} for ref ${params.referenceId} resolved within deadline.`,
      );
      return { breached: false };
    }

    const sla = await this.prisma.sLADefinition.findUnique({ where: { id: params.slaId } });
    if (!sla) return { breached: false };

    this.logger.warn(`SLA BREACHED: "${sla.name}" for reference ${params.referenceId}`);

    // Generate operational alert
    await this.prisma.operationalAlert.create({
      data: {
        tenantId: params.tenantId,
        type: "SLA_BREACH",
        severity: "HIGH",
        message: `SLA "${sla.name}" breached for reference ${params.referenceId}. Deadline was ${sla.deadlineHours} hours.`,
        source: "SLAOrchestratorEngine",
        metadata: JSON.stringify({ slaId: sla.id, referenceId: params.referenceId }),
      },
    });

    // Trigger escalation
    this.eventDispatcher.dispatch("automation", "sla_breached", {
      slaId: sla.id,
      slaName: sla.name,
      referenceId: params.referenceId,
      escalateToRole: sla.escalateToRole,
      module: sla.module,
    });

    return { breached: true, slaName: sla.name };
  }
}
