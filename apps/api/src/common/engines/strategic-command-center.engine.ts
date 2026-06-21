import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicCommandCenterEngine — "The Bridge" (Phase 16)
 *
 * The primary interface engine for leadership. Validates executive commands and
 * routes them safely through the Phase 11 governance boundary down to the
 * operational orchestration layers.
 */
@Injectable()
export class StrategicCommandCenterEngine {
  private readonly logger = new Logger(StrategicCommandCenterEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a strategic command session for a validated executive.
   */
  async initiateCommandSession(tenantId: string, executiveUserId: string, commandContext: unknown) {
    this.logger.log(
      `Initiating Strategic Command Session for Executive [${executiveUserId}] in Tenant [${tenantId}]`,
    );

    const session = await this.prisma.strategicCommandSession.create({
      data: {
        tenantId,
        executiveUserId,
        commandContext: JSON.stringify(commandContext),
        approvalHash: `EXEC_SIG_${Date.now()}_${Math.random()}`,
        executionStatus: "INITIATED",
      },
    });

    this.logger.debug(`Command Session [${session.id}] initiated. Awaiting Governance validation.`);
    return session;
  }
}
