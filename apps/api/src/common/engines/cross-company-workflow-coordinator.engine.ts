import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossCompanyWorkflowCoordinatorEngine — "The B2B Dispatcher" (Phase 31)
 *
 * Securely routes and translates workflows from Company A's internal Maal-Material
 * instance to Company B's Maal-Material environment.
 */
@Injectable()
export class CrossCompanyWorkflowCoordinatorEngine {
  private readonly logger = new Logger(CrossCompanyWorkflowCoordinatorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initiates a cryptographic-like execution contract between two separate tenants.
   */
  async initiateB2BWorkflow(sourceTenantId: string, targetTenantId: string, payload: unknown) {
    this.logger.debug(
      `Initiating Cross-Company Workflow: [${sourceTenantId}] -> [${targetTenantId}]`,
    );

    const contract = await this.prisma.crossCompanyWorkflowContract.create({
      data: {
        sourceTenantId,
        targetTenantId,
        workflowPayload: JSON.stringify(payload),
        executionStatus: "PENDING_HANDSHAKE",
      },
    });

    this.logger.log(
      `B2B Contract [${contract.id}] initialized. Awaiting handshake from target tenant!.`,
    );
    return contract;
  }
}
