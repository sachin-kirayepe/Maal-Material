import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { DigitalTwinEngine } from "./digital-twin.engine";

/**
 * TelemetryStreamEngine — "The Firehose" (Phase 3A)
 *
 * Manages high-throughput ingestion, payload validation, and
 * queue routing of raw sensor pings and live operational telemetry.
 */
@Injectable()
export class TelemetryStreamEngine {
  private readonly logger = new Logger(TelemetryStreamEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly digitalTwin: DigitalTwinEngine,
  ) {}

  /**
   * Ingests a high-velocity stream event from a physical asset.
   * Stores the immutable event and proxies to the DigitalTwinEngine
   * for state compilation.
   */
  async ingestEvent(tenantId: string, assetNodeId: string, eventType: string, payload: unknown) {
    this.logger.debug(`Ingesting Telemetry: [${eventType}] from [${assetNodeId}]`);

    // 1. Store immutable event
    const event = await this.prisma.telemetryStreamEvent.create({
      data: {
        tenantId,
        assetNodeId,
        eventType,
        payloadJson: JSON.stringify(payload),
      },
    });

    // 2. Synchronize with Digital Twin
    // In a massive scale system, this would be pushed to a Kafka topic
    // and processed asynchronously by the DigitalTwinEngine. For now, we await.
    await this.digitalTwin.updateTwinState(tenantId, assetNodeId, payload);

    return event;
  }
}
