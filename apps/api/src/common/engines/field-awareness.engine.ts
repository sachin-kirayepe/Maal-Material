import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FieldAwarenessEngine — "The Reality Auditor" (Phase 3L)
 *
 * Scans synchronized reality states to detect and emit `FieldAwarenessEvent`
 * records, alerting the enterprise of critical physical-world occurrences
 * like perimeter breaches or material deliveries.
 */
@Injectable()
export class FieldAwarenessEngine {
  private readonly logger = new Logger(FieldAwarenessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates a reality state and generates an awareness event if an anomaly/trigger is detected.
   */
  async triggerFieldEvent(
    tenantId: string,
    eventType: string,
    severity: string,
    eventData: unknown,
  ) {
    this.logger.warn(`Triggering Field Awareness Event: [${eventType}] Severity: ${severity}`);

    return this.prisma.fieldAwarenessEvent.create({
      data: {
        tenantId,
        eventType,
        severity,
        eventDataJson: JSON.stringify(eventData),
        resolved: false,
      },
    });
  }

  /**
   * Acknowledges and resolves a field event after upstream systems have reacted to it.
   */
  async resolveFieldEvent(eventId: string) {
    this.logger.log(`Resolving Field Awareness Event [${eventId}]`);

    return this.prisma.fieldAwarenessEvent.update({
      where: { id: eventId },
      data: { resolved: true },
    });
  }

  /**
   * Retrieves active critical field events requiring immediate orchestration response.
   */
  async getActiveCriticalEvents(tenantId: string) {
    return this.prisma.fieldAwarenessEvent.findMany({
      where: {
        tenantId,
        resolved: false,
        severity: { in: ["HIGH", "CRITICAL"] },
      },
      orderBy: { detectedAt: "desc" },
    });
  }
}
