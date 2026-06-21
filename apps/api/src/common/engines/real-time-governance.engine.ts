import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealTimeGovernanceEngine — "The Latency Sentinel" (Phase 3W)
 *
 * Acts as the live circuit breaker. Validates real-time events against
 * RealTimeOperationalGovernance policies to prevent latency-induced operational errors.
 */
@Injectable()
export class RealTimeGovernanceEngine {
  private readonly logger = new Logger(RealTimeGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines a real-time safety boundary for an operational zone.
   */
  async establishRealTimePolicy(tenantId: string, zone: string, maxLatencyMs: number) {
    this.logger.log(`Establishing Real-Time Governance Policy for Zone: [${zone}]`);

    return this.prisma.realTimeOperationalGovernance.create({
      data: {
        tenantId,
        operationalZone: zone,
        maxLatencyToleranceMs: maxLatencyMs,
        isActive: true,
      },
    });
  }

  /**
   * Validates if a high-frequency autonomous action is safe to execute based on current network latency.
   */
  async validateLiveActionSafety(
    tenantId: string,
    zone: string,
    currentLatencyMs: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Live Action Safety [Zone: ${zone}, Latency: ${currentLatencyMs}ms]`,
    );

    const policies = await this.prisma.realTimeOperationalGovernance.findMany({
      where: { tenantId, operationalZone: zone, isActive: true },
    });

    if (policies.length === 0) {
      this.logger.warn(
        `No real-time governance policies found for ${zone}. Defaulting to safe-halt if latency > 1000ms.`,
      );
      return currentLatencyMs <= 1000;
    }

    for (const policy of policies) {
      if (currentLatencyMs > policy.maxLatencyToleranceMs) {
        this.logger.error(
          `CRITICAL: Current latency (${currentLatencyMs}ms) exceeds policy tolerance (${policy.maxLatencyToleranceMs}ms). Live Action BLOCKED.`,
        );
        return false;
      }
    }

    return true; // Safe to execute in real-time
  }
}
