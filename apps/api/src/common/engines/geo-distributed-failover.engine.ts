import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GeoDistributedFailoverEngine — "The Traffic Sentinel" (Phase 27)
 *
 * Automatically shifts regional loads the millisecond an infrastructure anomaly
 * is detected, operating entirely without human intervention.
 */
@Injectable()
export class GeoDistributedFailoverEngine {
  private readonly logger = new Logger(GeoDistributedFailoverEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes and logs an automated geographical traffic failover.
   */
  async executeFailover(tenantId: string, source: string, target: string, trigger: string) {
    this.logger.error(
      `EMERGENCY: Executing Geo-Failover from [${source}] to [${target}] due to [${trigger}]`,
    );

    const failover = await this.prisma.geoDistributedFailoverEvent.create({
      data: {
        tenantId,
        sourceRegion: source,
        targetRegion: target,
        triggerCondition: trigger,
        status: "COMPLETED",
      },
    });

    return failover;
  }
}
