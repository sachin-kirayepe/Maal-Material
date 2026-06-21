import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FieldOperationDispatchEngine — "The Last Mile Connector" (Phase 12)
 *
 * Bridges theoretical Command Center tasks with the physical world by matching and dispatching
 * digital workflows to the most optimal, live physical contractor.
 */
@Injectable()
export class FieldOperationDispatchEngine {
  private readonly logger = new Logger(FieldOperationDispatchEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Matches a workforce task with an active contractor and dispatches the operation.
   */
  async dispatchOperation(tenantId: string, workforceTaskId: string, metrics: unknown) {
    this.logger.log(`Dispatching Field Operation for Workforce Task [${workforceTaskId}]`);

    // In production, an AI algorithm would sort contractors by GPS proximity and capability matrix.
    // For Phase 12 deployment, we grab an active contractor in the tenant's roster.
    const contractor = await this.prisma.fieldContractorProfile.findFirst({
      where: {
        tenantId,
        isActive: true,
        insuranceStatus: "VERIFIED",
      },
    });

    if (!contractor) {
      this.logger.error(
        `Dispatch Failed: No verified, active contractors found for Tenant [${tenantId}]`,
      );
      throw new Error("NO_AVAILABLE_CONTRACTORS");
    }

    const dispatch = await this.prisma.fieldOperationDispatch.create({
      data: {
        tenantId,
        workforceTaskId,
        contractorId: contractor.id,
        dispatchMetrics: JSON.stringify(metrics),
        executionStatus: "DISPATCHED",
      },
    });

    this.logger.log(
      `Operation successfully dispatched to Contractor [${contractor.id}]. Dispatch ID: [${dispatch.id}]`,
    );
    return dispatch;
  }
}
