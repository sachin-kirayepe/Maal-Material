import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AIGovernanceSafetyBoundaryEngine — "The Firewall" (Phase 18)
 *
 * Monitors internal AI behavior, immediately halting agents or intelligence
 * engines that hallucinate or propose unsafe operational parameters.
 */
@Injectable()
export class AIGovernanceSafetyBoundaryEngine {
  private readonly logger = new Logger(AIGovernanceSafetyBoundaryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a violation and quarantines an AI agent.
   */
  async registerViolation(
    tenantId: string,
    agentId: string,
    violationContext: unknown,
    severity: string = "CRITICAL",
  ) {
    this.logger.error(
      `AI Governance Violation Detected by Agent [${agentId}] in Tenant [${tenantId}]. Severity: ${severity}`,
    );

    const violation = await this.prisma.aIGovernanceBoundaryViolation.create({
      data: {
        tenantId,
        agentId,
        violationContext: JSON.stringify(violationContext),
        severity,
        remediationStatus: "QUARANTINED",
      },
    });

    return violation;
  }
}
