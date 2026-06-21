import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * ExecutiveAccountabilityEngine — "The Oath" (Phase 18)
 *
 * Manages the explicit human-in-the-loop requirement for catastrophic risk
 * operations, cryptographically binding an executive to a strategic decision.
 */
@Injectable()
export class ExecutiveAccountabilityEngine {
  private readonly logger = new Logger(ExecutiveAccountabilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a cryptographically bound executive sign-off.
   */
  async bindExecutiveSignature(
    tenantId: string,
    executiveUserId: string,
    decisionContext: unknown,
  ) {
    this.logger.log(`Binding Executive [${executiveUserId}] to Decision in Tenant [${tenantId}]`);

    const dataString = JSON.stringify(decisionContext);
    const signature = crypto
      .createHash("sha384")
      .update(`${tenantId}-${executiveUserId}-${dataString}-${Date.now()}`)
      .digest("hex");

    const record = await this.prisma.executiveAccountabilityRecord.create({
      data: {
        tenantId,
        executiveUserId,
        decisionContext: dataString,
        approvalSignature: signature,
        executionStatus: "APPROVED",
      },
    });

    return record;
  }
}
