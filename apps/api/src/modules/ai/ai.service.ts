import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) {}

  async getAiActionLogs(tenantId: string) {
    return this.prisma.aiActionLog.findMany({
      where: { tenantId },
      orderBy: { executedAt: "desc" },
      take: 50,
    });
  }

  async getBusinessContext(tenantId: string) {
    return this.prisma.businessContext.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
  }

  // Future Orchestrator entry point - P1 Security Remediation (AI Sandbox)
  async dispatchCommand(tenantId: string, command: string, payload: unknown) {
    this.logger.log(
      `Received AI Command [${command}] for tenant ${tenantId}. Sandboxing execution.`,
    );

    const log = await this.prisma.aiActionLog.create({
      data: {
        tenantId,
        actionType: command,
        description: `Triggered command: ${command}. Awaiting Human Authorization.`,
        payload: JSON.stringify(payload),
        // SECURITY P1: Never allow AI to execute directly against the Ledger.
        status: "PENDING_HUMAN_APPROVAL",
      },
    });

    return log;
  }
}
