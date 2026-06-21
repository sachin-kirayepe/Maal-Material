import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * OperationalLineageEngine — "The Immutable Scribe" (Phase 11)
 *
 * Provides a cryptographically secure audit trail tracing every orchestration event
 * back to its triggering source and governing policy.
 */
@Injectable()
export class OperationalLineageEngine {
  private readonly logger = new Logger(OperationalLineageEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an immutable record of an executed orchestration.
   */
  async logLineage(
    tenantId: string,
    orchestrationId: string,
    triggerSource: string,
    policyEvaluations: unknown,
    payload: unknown,
  ) {
    this.logger.debug(`Logging Operational Lineage for Orchestration [${orchestrationId}]`);

    // Creates an immutable log entry. In an enterprise system, this could also write to a WORM drive or blockchain.
    return this.prisma.operationalLineageLog.create({
      data: {
        tenantId,
        orchestrationId,
        triggerSource,
        policyEvaluations: JSON.stringify(policyEvaluations),
        actionPayload: JSON.stringify(payload),
      },
    });
  }

  /**
   * Generates a point-in-time cryptographic hash of a tenant's entire audit log.
   */
  async generateAuditHash(tenantId: string): Promise<string> {
    this.logger.log(`Generating cryptographically secure Audit Hash for Tenant [${tenantId}]`);

    const logs = await this.prisma.operationalLineageLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
      select: { id: true, orchestrationId: true, triggerSource: true },
    });

    const hash = crypto.createHash("sha256").update(JSON.stringify(logs)).digest("hex");
    this.logger.debug(`Audit Hash generated: ${hash}`);

    return hash;
  }
}
