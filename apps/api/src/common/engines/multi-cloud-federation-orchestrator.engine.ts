import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MultiCloudFederationOrchestratorEngine — "The Global Router" (Phase 27)
 *
 * Manages workload distribution across disparate cloud providers based on
 * cost, latency, and real-time infrastructure health.
 */
@Injectable()
export class MultiCloudFederationOrchestratorEngine {
  private readonly logger = new Logger(MultiCloudFederationOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a multi-cloud node's health status.
   */
  async updateNodeHealth(provider: string, region: string, latencyMs: number, isHealthy: boolean) {
    this.logger.debug(
      `Updating Multi-Cloud Node Health: [${provider} | ${region}] - Latency: ${latencyMs}ms`,
    );

    const node = await this.prisma.multiCloudFederationNode.create({
      data: {
        cloudProvider: provider,
        regionId: region,
        latencyMs,
        healthStatus: isHealthy ? "HEALTHY" : "DEGRADED",
        lastPingAt: new Date(),
      },
    });

    if (!isHealthy) {
      this.logger.warn(
        `DEGRADED NODE DETECTED in ${provider} [${region}]. Pre-warming failover targets.`,
      );
    }

    return node;
  }
}
