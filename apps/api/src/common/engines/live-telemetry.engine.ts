import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LiveTelemetryEngine — "The Physical Sensor" (Phase 3L)
 *
 * Ingests, queues, and processes massive volumes of `LiveTelemetryStream`
 * data originating from physical anchors in the field.
 */
@Injectable()
export class LiveTelemetryEngine {
  private readonly logger = new Logger(LiveTelemetryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ingests a raw data ping from a physical reality anchor.
   */
  async ingestTelemetry(
    tenantId: string,
    anchorId: string,
    telemetryType: string,
    dataPayload: unknown,
  ) {
    this.logger.debug(`Ingesting Live Telemetry: [${telemetryType}] from Anchor [${anchorId}]`);

    return this.prisma.liveTelemetryStream.create({
      data: {
        tenantId,
        anchorId,
        telemetryType,
        dataPayloadJson: JSON.stringify(dataPayload),
        processed: false,
      },
    });
  }

  /**
   * Retrieves unprocessed telemetry streams for the synchronization engine.
   */
  async pullUnprocessedTelemetry(tenantId: string, limit: number = 200) {
    return this.prisma.liveTelemetryStream.findMany({
      where: { tenantId, processed: false },
      orderBy: { ingestedAt: "asc" }, // FIFO processing for state accuracy
      take: limit,
    });
  }

  /**
   * Marks a batch of telemetry packets as processed.
   */
  async acknowledgeTelemetry(streamIds: string[]) {
    return this.prisma.liveTelemetryStream.updateMany({
      where: { id: { in: streamIds } },
      data: { processed: true },
    });
  }
}
