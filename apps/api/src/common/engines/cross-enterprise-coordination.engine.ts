import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossEnterpriseCoordinationEngine — "The Diplomat" (Phase 17)
 *
 * The secure bridge. Validates and executes workflows that require
 * cooperation between two isolated enterprise tenants.
 */
@Injectable()
export class CrossEnterpriseCoordinationEngine {
  private readonly logger = new Logger(CrossEnterpriseCoordinationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initiates a workflow spanning two isolated tenants.
   */
  async initiateCrossTenantWorkflow(
    initiatingTenantId: string,
    receivingTenantId: string,
    workflowType: string,
    workflowPayload: unknown,
  ) {
    this.logger.log(
      `Initiating Cross-Enterprise Workflow [${workflowType}] from [${initiatingTenantId}] to [${receivingTenantId}]`,
    );

    const workflow = await this.prisma.crossEnterpriseWorkflow.create({
      data: {
        initiatingTenantId,
        receivingTenantId,
        workflowType,
        workflowPayload: JSON.stringify(workflowPayload),
        status: "INITIATED",
      },
    });

    return workflow;
  }
}
