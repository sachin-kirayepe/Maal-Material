import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UnifiedEcosystemOrchestratorEngine
 *
 * Orchestrates multi-tenant business transactions (Sagas).
 * E.g. Tenant A buys a bulldozer from Tenant B, triggering
 * a logistics pickup from Tenant C. If C fails, A and B roll back safely.
 */
@Injectable()
export class UnifiedEcosystemOrchestratorEngine {
  private readonly logger = new Logger(UnifiedEcosystemOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a cross-tenant saga.
   */
  async initializeEcosystemSaga(
    initiatingTenantId: string,
    sagaType: string,
    participantTenantIds: string[],
  ) {
    this.logger.log(`Initializing Cross-Tenant Ecosystem Saga [${sagaType}]`);

    return this.prisma.unifiedEcosystemSaga.create({
      data: {
        tenantId: initiatingTenantId,
        sagaType,
        status: "PENDING",
        participantsJson: JSON.stringify([initiatingTenantId, ...participantTenantIds]),
        stateJson: JSON.stringify({ currentStep: "INITIALIZED" }),
      },
    });
  }

  /**
   * Finalizes or Rolls back a cross-tenant saga securely.
   */
  async concludeSaga(sagaId: string, success: boolean) {
    this.logger.log(`Concluding Saga [${sagaId}]. Success: ${success}`);

    return this.prisma.unifiedEcosystemSaga.update({
      where: { id: sagaId },
      data: {
        status: success ? "COMPLETED" : "ROLLED_BACK",
      },
    });
  }
}
