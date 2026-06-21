import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseComplianceOrchestrationEngine — "The Regulator" (Phase 18)
 *
 * Evaluates incoming workflows and operational commands against active
 * EnterpriseCompliancePolicy records before execution is allowed.
 */
@Injectable()
export class EnterpriseComplianceOrchestrationEngine {
  private readonly logger = new Logger(EnterpriseComplianceOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new enterprise compliance policy.
   */
  async registerPolicy(
    tenantId: string,
    policyName: string,
    policyDefinition: unknown,
    enforcementLevel: string = "STRICT",
  ) {
    this.logger.log(
      `Registering Compliance Policy [${policyName}] for Tenant [${tenantId}] with enforcement: ${enforcementLevel}`,
    );

    const policy = await this.prisma.enterpriseCompliancePolicy.create({
      data: {
        tenantId,
        policyName,
        policyDefinition: JSON.stringify(policyDefinition),
        enforcementLevel,
      },
    });

    return policy;
  }
}
