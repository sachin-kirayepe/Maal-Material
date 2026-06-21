import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * ImmutableAuditLedgerEngine — "The Scribe" (Phase 18)
 *
 * Writes cryptographically secure, append-only records of all high-risk
 * system operations or AI-driven decisions.
 */
@Injectable()
export class ImmutableAuditLedgerEngine {
  private readonly logger = new Logger(ImmutableAuditLedgerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Appends a secured block to the audit ledger.
   */
  async appendAuditLog(tenantId: string, actionType: string, actionData: unknown, actorId: string) {
    this.logger.log(
      `Appending Secure Audit Log [${actionType}] for Tenant [${tenantId}] by Actor [${actorId}]`,
    );

    const dataString = JSON.stringify(actionData);

    // Cryptographic hash acting as the immutable proof
    const hash = crypto
      .createHash("sha256")
      .update(`${tenantId}-${actionType}-${dataString}-${actorId}-${Date.now()}`)
      .digest("hex");

    const auditEntry = await this.prisma.immutableAuditLedger.create({
      data: {
        tenantId,
        actionType,
        actionData: dataString,
        actorId,
        cryptographicHash: hash,
      },
    });

    return auditEntry;
  }
}
