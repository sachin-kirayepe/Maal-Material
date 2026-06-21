import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseContinuityAnalyticsEngine — "The Continuity Auditor" (Phase 27)
 *
 * Constantly audits the mathematical limits of the system, verifying
 * that Maal-Material can recover within strict enterprise RTO and RPO SLAs.
 */
@Injectable()
export class EnterpriseContinuityAnalyticsEngine {
  private readonly logger = new Logger(EnterpriseContinuityAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the enterprise's compliance with strict disaster recovery SLAs.
   */
  async evaluateContinuitySLA(
    tenantId: string,
    targetRto: number,
    targetRpo: number,
    actualRto: number,
    actualRpo: number,
  ) {
    this.logger.debug(
      `Evaluating Continuity SLAs for Tenant [${tenantId}] - RTO: ${actualRto}/${targetRto} | RPO: ${actualRpo}/${targetRpo}`,
    );

    const isCompliant = actualRto <= targetRto && actualRpo <= targetRpo;

    const metric = await this.prisma.enterpriseContinuityMetrics.create({
      data: {
        tenantId,
        recoveryTimeObj: targetRto,
        recoveryPointObj: targetRpo,
        actualRto,
        actualRpo,
        slaCompliance: isCompliant,
      },
    });

    if (!isCompliant) {
      this.logger.error(
        `SLA BREACH: Tenant [${tenantId}] has failed its Disaster Recovery objectives. Infrastructure optimization required.`,
      );
    }

    return metric;
  }
}
