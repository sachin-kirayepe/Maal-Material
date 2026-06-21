import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ImmortalCivilizationRegistryEngine — "The Timekeeper" (Phase 25)
 *
 * Manages the lifecycle of long-living persistent entities, preventing platform
 * entropy over decades by ensuring core subsystems survive restarts and upgrades.
 */
@Injectable()
export class ImmortalCivilizationRegistryEngine {
  private readonly logger = new Logger(ImmortalCivilizationRegistryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a heartbeat for an immortal subsystem.
   */
  async recordHeartbeat(
    entityName: string,
    entityType: string,
    lifespanDays: number,
    entropyScore: number,
  ) {
    this.logger.debug(
      `Recording Immortal Heartbeat for [${entityName}] - Lifespan: ${lifespanDays} days`,
    );

    const registry = await this.prisma.immortalCivilizationRegistry.upsert({
      where: { entityName },
      update: {
        lifespanDays,
        entropyScore,
        lastHeartbeatAt: new Date(),
      },
      create: {
        entityName,
        entityType,
        lifespanDays,
        entropyScore,
        lastHeartbeatAt: new Date(),
      },
    });

    if (entropyScore > 0.8) {
      this.logger.warn(
        `DANGEROUS ENTROPY LEVEL DETECTED for Immortal Entity [${entityName}]. Re-initialization recommended.`,
      );
    }

    return registry;
  }
}
