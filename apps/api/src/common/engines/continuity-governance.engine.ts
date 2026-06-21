import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ContinuityGovernanceEngine — "The Safety Net"
 *
 * Evaluates all proposed self-healing actions against ContinuityGovernancePolicy
 * constraints before execution. Blocks any recovery that would exceed human-defined limits.
 */
@Injectable()
export class ContinuityGovernanceEngine {
  private readonly logger = new Logger(ContinuityGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks whether a proposed auto-recovery action is permitted under governance policies.
   * Returns true if permitted, false if the action should be blocked and escalated.
   */
  async isRecoveryPermitted(tenantId: string, faultDomain: string): Promise<boolean> {
    this.logger.debug(
      `Evaluating continuity governance for domain [${faultDomain}] in Tenant [${tenantId}]`,
    );

    // Find applicable policies — domain-specific or global wildcard
    const policies = await this.prisma.continuityGovernancePolicy.findMany({
      where: {
        tenantId,
        isActive: true,
        targetDomain: { in: [faultDomain, "*"] },
      },
    });

    if (policies.length === 0) {
      this.logger.warn(
        `No continuity policy found for [${faultDomain}]. Defaulting to DENY (fail-secure).`,
      );
      return false;
    }

    for (const policy of policies) {
      // Count recent auto-recoveries in the policy's time window
      const windowStart = new Date(Date.now() - policy.timeWindowMinutes * 60 * 1000);

      const recentFaults = await this.prisma.infrastructureFaultEvent.count({
        where: {
          tenantId,
          faultDomain,
          detectedAt: { gte: windowStart },
        },
      });

      if (recentFaults >= policy.maxAutoRecoveries) {
        this.logger.error(
          `GOVERNANCE BREACH: Domain [${faultDomain}] has hit ${recentFaults}/${policy.maxAutoRecoveries} ` +
            `auto-recoveries in ${policy.timeWindowMinutes}min. Recovery BLOCKED.`,
        );

        if (policy.escalateOnBreach) {
          this.logger.error(`Escalating to human operators for domain [${faultDomain}].`);
          // In production: emit escalation event to Command Center / PagerDuty
        }

        return false;
      }
    }

    this.logger.log(`Recovery PERMITTED for domain [${faultDomain}] under governance policy.`);
    return true;
  }
}
