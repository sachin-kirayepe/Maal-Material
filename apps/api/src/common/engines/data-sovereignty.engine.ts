import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DataSovereigntyEngine
 *
 * Ensures that payloads routed to specific database shards or object stores
 * comply strictly with geopolitical MultiRegionDataResidency rules.
 */
@Injectable()
export class DataSovereigntyEngine {
  private readonly logger = new Logger(DataSovereigntyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates whether a data payload can be legally transmitted to a target region.
   */
  async evaluateTransferCompliance(
    tenantId: string,
    currentRegion: string,
    targetRegion: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Evaluating Data Sovereignty: Transfer from [${currentRegion}] to [${targetRegion}] for Tenant [${tenantId}]`,
    );

    const rule = await this.prisma.multiRegionDataResidency.findFirst({
      where: { tenantId, regionCode: currentRegion },
    });

    // If no rule exists, default to strict isolated residency (Fail-Secure)
    if (!rule) {
      this.logger.warn(
        `No residency rules found for Tenant ${tenantId} in ${currentRegion}. Blocking transfer.`,
      );
      return false;
    }

    if (rule.strictIsolation) {
      this.logger.warn(
        `Strict Isolation enforced for Tenant ${tenantId} in ${currentRegion}. Data cannot leave the region.`,
      );
      return false;
    }

    const allowedRegions: string[] = JSON.parse(rule.allowedRegions);
    if (!allowedRegions.includes(targetRegion)) {
      this.logger.error(
        `Compliance Violation: Target region [${targetRegion}] is not in allowed regions [${allowedRegions.join(", ")}]`,
      );
      return false;
    }

    this.logger.log(
      `Data Transfer to [${targetRegion}] Approved per ${rule.complianceStandard} standards.`,
    );
    return true;
  }
}
