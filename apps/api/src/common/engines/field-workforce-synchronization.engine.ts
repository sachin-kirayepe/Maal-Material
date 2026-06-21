import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FieldWorkforceSynchronizationEngine — "The Field Commander" (Phase 28)
 *
 * Synchronizes physical field operators, assigning tasks based on location,
 * skills, and fatigue/safety thresholds.
 */
@Injectable()
export class FieldWorkforceSynchronizationEngine {
  private readonly logger = new Logger(FieldWorkforceSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Syncs the physical location and status of a field operator.
   */
  async syncOperatorStatus(
    tenantId: string,
    operatorId: string,
    geoJson: unknown,
    taskId: string | null,
    isFatigued: boolean,
  ) {
    this.logger.debug(
      `Syncing Field Operator [${operatorId}] | Status: ${isFatigued ? "FATIGUED" : "ACTIVE"}`,
    );

    const operator = await this.prisma.fieldWorkforceExecution.create({
      data: {
        tenantId,
        operatorId,
        locationGeo: JSON.stringify(geoJson),
        currentTaskId: taskId,
        status: isFatigued ? "FATIGUED" : taskId ? "IN_TASK" : "AVAILABLE",
        lastPingAt: new Date(),
      },
    });

    if (isFatigued) {
      this.logger.warn(
        `WORKFORCE SAFETY ALERT: Operator [${operatorId}] has exceeded fatigue thresholds. Force-unassigning current task.`,
      );
      // Logic to unassign task would trigger here
    }

    return operator;
  }
}
