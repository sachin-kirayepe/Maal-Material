import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveBottleneckEngine — "The Impediment Detector" (Phase 13)
 *
 * Constantly analyzes Phase 12 FieldOperationDispatch records to identify
 * recurring delays and generate OperationalBottleneckAlerts.
 */
@Injectable()
export class AdaptiveBottleneckEngine {
  private readonly logger = new Logger(AdaptiveBottleneckEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a detected bottleneck that is slowing down physical execution.
   */
  async flagOperationalBottleneck(
    tenantId: string,
    bottleneckType: string,
    rootCause: unknown,
    taskIds: string[],
  ) {
    this.logger.warn(
      `Flagging Operational Bottleneck [${bottleneckType}] affecting ${taskIds.length} tasks.`,
    );

    return this.prisma.operationalBottleneckAlert.create({
      data: {
        tenantId,
        bottleneckType,
        rootCauseAnalysis: JSON.stringify(rootCause),
        affectedTasks: JSON.stringify(taskIds),
        isResolved: false,
      },
    });
  }

  /**
   * Marks a previously flagged bottleneck as resolved.
   */
  async resolveBottleneck(alertId: string) {
    this.logger.log(`Resolving Operational Bottleneck [${alertId}]`);

    return this.prisma.operationalBottleneckAlert.update({
      where: { id: alertId },
      data: { isResolved: true },
    });
  }
}
