import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialActivityEngine
 *
 * Ingests high-velocity physical activity streams from IoT devices and
 * enriches the platform's digital twin state.
 */
@Injectable()
export class IndustrialActivityEngine {
  private readonly logger = new Logger(IndustrialActivityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a high-fidelity industrial activity event to the activity stream.
   */
  async ingestActivity(
    tenantId: string,
    entityId: string,
    activityType: string,
    metadata: unknown,
    sourceDeviceId: string,
  ) {
    this.logger.debug(
      `Ingesting Activity [${activityType}] for Entity [${entityId}] from Device [${sourceDeviceId}]`,
    );

    // 1. Log the immutable stream event
    const event = await this.prisma.industrialActivityStream.create({
      data: {
        tenantId,
        entityId,
        activityType,
        metadataJson: JSON.stringify(metadata),
        sourceDeviceId,
      },
    });

    // 2. We would normally pipe this to ContextualStateTriggerEngine and
    // update DigitalTwinState if applicable. For now, just return the event.

    return event;
  }
}
