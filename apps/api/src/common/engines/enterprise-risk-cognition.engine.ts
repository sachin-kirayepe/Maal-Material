import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseRiskCognitionEngine — "The Sentinel" (Phase 16)
 *
 * Continuously scans active workflows, supplier data, and global ecosystem
 * feeds to flag critical operational and systemic risks.
 */
@Injectable()
export class EnterpriseRiskCognitionEngine {
  private readonly logger = new Logger(EnterpriseRiskCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a newly identified enterprise risk.
   */
  async identifyRisk(
    tenantId: string,
    riskCategory: string,
    severityLevel: string,
    riskData: unknown,
    mitigationPlan?: unknown,
  ) {
    this.logger.log(
      `Identifying Enterprise Risk [${severityLevel}] in category [${riskCategory}] for Tenant [${tenantId}]`,
    );

    const risk = await this.prisma.enterpriseRiskAnalysis.create({
      data: {
        tenantId,
        riskCategory,
        severityLevel,
        riskData: JSON.stringify(riskData),
        mitigationPlan: mitigationPlan ? JSON.stringify(mitigationPlan) : null,
        isActive: true,
      },
    });

    return risk;
  }
}
