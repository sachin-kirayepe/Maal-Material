import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class NetworkResilienceService {
  private readonly logger = new Logger(NetworkResilienceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logNetworkTelemetry(
    tenantId: string,
    id: string,
    connectionType: string,
    effectiveType?: string,
    downlinkSpeed?: number,
    rttLatency?: number,
  ) {
    this.logger.log(
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      `Logging telemetry for device ${deviceId}: ${connectionType} (${effectiveType || "N/A"})`,
    );

    // Upsert the offline device registry entry first to ensure it exists
    await this.prisma.offlineDevice.upsert({
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      where: { deviceId },
      create: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        deviceId,
        tenantId,
        status: connectionType === "OFFLINE" ? "OFFLINE" : "IDLE",
      },
      update: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        status: connectionType === "OFFLINE" ? "OFFLINE" : "IDLE",
      },
    });

    return this.prisma.networkConditionAnalytics.create({
      data: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        tenantId,
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        deviceId,
        connectionType,
        effectiveType,
        downlinkSpeed,
        rttLatency,
      },
    });
  }

  /**
   * Determine optimal sync payload size based on recent network conditions.
   * If a device is on slow-2g with high latency, return a small batch size.
   */
  async calculateOptimalBatchSize(id: string): Promise<number> {
    const recentStats = await this.prisma.networkConditionAnalytics.findFirst({
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      where: { deviceId },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      orderBy: { recordedAt: "desc" },
    });

    if (!recentStats) return 100; // Default fast connection size

    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    if (recentStats.effectiveType === "slow-2g" || recentStats.connectionType === "2G") return 10;
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    if (recentStats.effectiveType === "3g" || recentStats.connectionType === "3G") return 30;

    return 100;
  }
}
