import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DeveloperAPITelemetryEngine — "The Ecosystem Meter" (Phase 32)
 *
 * Tracks global API usage by third-party apps to enforce rate limits
 * and generate ecosystem monetization data.
 */
@Injectable()
export class DeveloperAPITelemetryEngine {
  private readonly logger = new Logger(DeveloperAPITelemetryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a third-party API call for billing and rate-limiting.
   */
  async recordApiUsage(appId: string, endpointPath: string) {
    this.logger.debug(`Recording API Telemetry for App [${appId}] at [${endpointPath}]`);

    const timestampBucket = new Date();
    timestampBucket.setMinutes(0, 0, 0); // Round to nearest hour

    // Using raw SQL logic here, simplified for Prisma create
    const metric = await this.prisma.developerAPIUsageMetric.create({
      data: {
        appId,
        endpointPath,
        callCount: 1,
        timestampBucket,
      },
    });

    return metric;
  }
}
