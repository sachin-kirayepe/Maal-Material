import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * HighThroughputEventBufferEngine — "The Shock Absorber" (Phase 21)
 *
 * Absorbs massive incoming telemetry spikes into optimized bulk inserts
 * to protect the core execution databases from the "Thundering Herd" problem.
 */
@Injectable()
export class HighThroughputEventBufferEngine {
  private readonly logger = new Logger(HighThroughputEventBufferEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Buffers a high-throughput event for batch processing.
   */
  async bufferEvent(tenantId: string, eventType: string, eventPayload: unknown) {
    this.logger.debug(`Buffering High-Throughput Event [${eventType}] for Tenant [${tenantId}]`);

    const bufferedEvent = await this.prisma.highThroughputEventQueue.create({
      data: {
        tenantId,
        eventType,
        eventPayload: JSON.stringify(eventPayload),
        processingStatus: "PENDING",
      },
    });

    return bufferedEvent;
  }
}
